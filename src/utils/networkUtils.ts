import { Buffer } from 'buffer';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  PublicKey,
  Transaction,
  Connection
} from '@solana/web3.js';
import {
  storeFileExistenceOnChain,
  PROGRAM_ID  
} from './blockchainUtils';

// ------------------- TYPES -------------------
export interface NetworkMember {
  walletAddress: string;
  username: string;
  joinedAt: string;
  role: 'admin' | 'member';
  reputation: number;
}

export interface Network {
  id: string;
  name: string;
  adminWallet: string;
  joinKey: string;
  createdAt: string;
  members: NetworkMember[];
}

export interface NetworkFileRecord {
  id: string;
  networkId: string;
  fileName: string;
  fileHash: string;
  sha256Hash?: string;
  size: number;
  uploaderWallet: string;
  uploaderUsername: string;
  uploadDate: string;
  ipfsUrl: string;
  blockchainTx?: string;
}

interface ConnectedWallet {
  publicKey: PublicKey;
  sendTransaction: (tx: Transaction, connection: Connection) => Promise<string>;
}

interface FileRecord {
  name: string;
  hash: string;
  size: number;
  ipfsUrl: string;
}

// ------------------- SECURITY -------------------
const sanitize = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"\'\/\\]/g, '') // strip XSS chars
    .substring(0, 100); // max 100 chars
};

// ------------------- NETWORK UTILITIES -------------------
export const generateJoinKey = (): string =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

export const createNetwork = async (
  networkName: string,
  adminWallet: string,
  adminUsername: string
): Promise<Network> => {
  const sanitizedName = sanitize(networkName);
  const sanitizedUsername = sanitize(adminUsername);
  const joinKey = generateJoinKey();
  
  const networkData = {
    name: sanitizedName,
    adminWallet,
    joinKey,
    createdAt: serverTimestamp(),
    members: [{
      walletAddress: adminWallet,
      username: sanitizedUsername,
      joinedAt: new Date().toISOString(),
      role: 'admin' as const,
      reputation: 2701
    }]
  };
  const docRef = await addDoc(collection(db, 'networks'), networkData);
  return {
    id: docRef.id,
    name: sanitizedName,
    adminWallet,
    joinKey,
    createdAt: new Date().toISOString(),
    members: networkData.members
  };
};

export const joinNetwork = async (
  networkName: string,
  joinKey: string,
  userWallet: string,
  username: string
): Promise<Network> => {
  const sanitizedUsername = sanitize(username);
  const q = query(
    collection(db, 'networks'),
    where('name', '==', networkName),
    where('joinKey', '==', joinKey)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error('Network not found or invalid join key');
  const networkDoc = snapshot.docs[0];
  const networkData = networkDoc.data();
  if (networkData.members.some((m: any) => m.walletAddress === userWallet)) {
    throw new Error('You are already a member of this network');
  }
  const newMember: NetworkMember = {
    walletAddress: userWallet,
    username: sanitizedUsername,
    joinedAt: new Date().toISOString(),
    role: 'member' as const,
    reputation: 2701
  };
  await updateDoc(doc(db, 'networks', networkDoc.id), {
    members: [...networkData.members, newMember]
  });
  return {
    id: networkDoc.id,
    name: networkData.name,
    adminWallet: networkData.adminWallet,
    joinKey: networkData.joinKey,
    createdAt: (networkData.createdAt?.toDate() ?? new Date()).toISOString(),
    members: [...networkData.members, newMember].map((m: any) => ({
      ...m,
      joinedAt: m.joinedAt?.toDate ? m.joinedAt.toDate().toISOString() : (m.joinedAt || new Date().toISOString())
    }))
  };
};

export const leaveNetwork = async (networkId: string, userWallet: string): Promise<void> => {
  const networkRef = doc(db, 'networks', networkId);
  const snap = await getDoc(networkRef);
  if (!snap.exists()) throw new Error('Network not found');
  const networkData = snap.data() as Network;
  if (networkData.adminWallet === userWallet) throw new Error('Admin cannot leave. Transfer rights first.');
  const updatedMembers = networkData.members.filter(m => m.walletAddress !== userWallet);
  await updateDoc(networkRef, { members: updatedMembers });
};

export const getUserNetworks = async (userWallet: string): Promise<Network[]> => {
  const q = query(collection(db, 'networks'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const networks: Network[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.members.some((m: any) => m.walletAddress === userWallet)) {
      networks.push({
        id: doc.id,
        name: data.name,
        adminWallet: data.adminWallet,
        joinKey: data.joinKey,
        createdAt: (data.createdAt?.toDate() ?? new Date()).toISOString(),
        members: (data.members || []).map((m: any) => ({
          ...m,
          joinedAt: m.joinedAt?.toDate ? m.joinedAt.toDate().toISOString() : (m.joinedAt || new Date().toISOString())
        }))
      });
    }
  });
  return networks;
};

export const getUserRole = async (
  networkId: string,
  userWallet: string
): Promise<'admin' | 'member' | null> => {
  const snap = await getDoc(doc(db, 'networks', networkId));
  if (!snap.exists()) return null;
  const networkData = snap.data();
  const member = networkData.members?.find((m: any) => m.walletAddress === userWallet);
  return member?.role ?? null;
};

// ------------------- FILE UTILITIES -------------------
export const storeNetworkFile = async (
  networkId: string,
  fileRecord: FileRecord,
  uploaderWallet: string,
  uploaderUsername: string,
  connectedWallet: ConnectedWallet
): Promise<{ success: boolean, isDuplicate?: boolean, duplicateInfo?: any }> => {
  try {
    const sanitizedUsername = sanitize(uploaderUsername || uploaderWallet);
    
    // 1️⃣ Check duplicate in Firebase
    const dupQuery = query(
      collection(db, 'networkFiles'),
      where('networkId', '==', networkId),
      where('fileHash', '==', fileRecord.hash)
    );
    const dupSnap = await getDocs(dupQuery);
    if (!dupSnap.empty) {
      const original = dupSnap.docs[0].data();
      return { success: false, isDuplicate: true, duplicateInfo: { originalUploader: original.uploaderUsername } };
    }

    // 2️⃣ Store existence on-chain (hash only)
    let blockchainTx: string | null = null;
    try {
      const [networkPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("network"), Buffer.from(networkId)],
        PROGRAM_ID
      );

      blockchainTx = await storeFileExistenceOnChain(
        connectedWallet,
        networkPDA,
        fileRecord.hash
      );
    } catch (err) {
      console.warn('Blockchain storage failed, Firebase only', err);
    }

    // 3️⃣ Store full record in Firebase
    const dataToStore = {
      networkId,
      fileName: sanitize(fileRecord.name),
      fileHash: fileRecord.hash,
      size: fileRecord.size,
      uploaderWallet,
      uploaderUsername: sanitizedUsername,
      uploadDate: serverTimestamp(),
      ipfsUrl: fileRecord.ipfsUrl,
      storedOnChain: !!blockchainTx,
      blockchainTx: blockchainTx || null
    };

    await addDoc(collection(db, 'networkFiles'), dataToStore);
    return { success: true };
  } catch (error) {
    console.error('Error storing network file:', error);
    throw new Error('Failed to store network file.');
  }
};

export const getNetworkFilesByNetworkId = async (networkId: string): Promise<NetworkFileRecord[]> => {
  const q = query(
    collection(db, 'networkFiles'),
    where('networkId', '==', networkId),
    orderBy('uploadDate', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      networkId: data.networkId,
      fileName: data.fileName,
      fileHash: data.fileHash,
      sha256Hash: data.sha256Hash,
      size: data.size,
      uploaderWallet: data.uploaderWallet,
      uploaderUsername: data.uploaderUsername,
      uploadDate: (data.uploadDate?.toDate() ?? new Date()).toISOString(),
      ipfsUrl: data.ipfsUrl,
      blockchainTx: data.blockchainTx
    };
  });
};

// ------------------- REPUTATION & ALERTS -------------------
export const updateUserReputation = async (networkId: string, wallet: string, change: number) => {
  const ref = doc(db, 'networks', networkId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Network not found');
  const members = snap.data().members.map((m: any) =>
    m.walletAddress === wallet ? { ...m, reputation: Math.max(0, m.reputation + change) } : m
  );
  await updateDoc(ref, { members });
};

export const createDuplicateAlert = async (networkId: string, info: any) => {
  await addDoc(collection(db, 'networkAlerts'), {
    networkId,
    type: 'duplicate',
    ...info,
    isRead: false,
    createdAt: serverTimestamp()
  });
};

export const markAlertAsRead = async (alertId: string) => {
  await updateDoc(doc(db, 'networkAlerts', alertId), { isRead: true, readAt: new Date().toISOString() });
};

export const getNetworkAlerts = async (networkId: string) => {
  const q = query(
    collection(db, 'networkAlerts'),
    where('networkId', '==', networkId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt?.toDate() ?? new Date()).toISOString()
    };
  });
};

// ------------------- ELO FUNCTIONS -------------------
export const getUserElo = async (wallet: string): Promise<number> => {
  const ref = doc(db, "users", wallet);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data().elo || 2701;
  await setDoc(ref, { elo: 2701, lastUpdated: new Date().toISOString() });
  return 2701;
};

export const updateUserElo = async (wallet: string, newElo: number) => {
  const ref = doc(db, "users", wallet);
  await setDoc(ref, { elo: Math.max(0, newElo), lastUpdated: new Date().toISOString() }, { merge: true });
};

export const checkDuplicate = async (fileHash: string, networkId: string): Promise<any | null> => {
  const dupQuery = query(
    collection(db, 'networkFiles'),
    where('networkId', '==', networkId),
    where('fileHash', '==', fileHash)
  );
  const dupSnap = await getDocs(dupQuery);
  if (!dupSnap.empty) {
    return dupSnap.docs[0].data();
  }
  return null;
};

export const anchorOnChain = async (
  networkId: string,
  fileHash: string,
  connectedWallet: ConnectedWallet
): Promise<string | null> => {
  try {
    const [networkPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("network"), Buffer.from(networkId)],
      PROGRAM_ID
    );

    const blockchainTx = await storeFileExistenceOnChain(
      connectedWallet,
      networkPDA,
      fileHash
    );
    return blockchainTx;
  } catch (err) {
    console.warn('Blockchain storage failed', err);
    return null;
  }
};

export const saveFileRecord = async (
  networkId: string,
  fileRecord: FileRecord,
  uploaderWallet: string,
  uploaderUsername: string,
  blockchainTx: string | null
): Promise<void> => {
  const sanitizedUsername = sanitize(uploaderUsername || uploaderWallet);
  const dataToStore = {
    networkId,
    fileName: sanitize(fileRecord.name),
    fileHash: fileRecord.hash,
    size: fileRecord.size,
    uploaderWallet,
    uploaderUsername: sanitizedUsername,
    uploadDate: serverTimestamp(),
    ipfsUrl: fileRecord.ipfsUrl,
    storedOnChain: !!blockchainTx,
    blockchainTx: blockchainTx || null
  };

  await addDoc(collection(db, 'networkFiles'), dataToStore);
};
