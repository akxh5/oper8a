import { Buffer } from "buffer";
import { PublicKey, Transaction, Connection } from "@solana/web3.js";

declare global {
  interface Window {
    solana?: any;
  }
}

class WalletConnection {
  private static instance: WalletConnection;
  private _wallet: any = null;
  private _publicKey: PublicKey | null = null;

  private constructor() {}

  static getInstance(): WalletConnection {
    if (!WalletConnection.instance) {
      WalletConnection.instance = new WalletConnection();
    }
    return WalletConnection.instance;
  }

  async connect(): Promise<{ publicKey: string }> {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet not found!");
    }

    const response = await window.solana.connect();
    this._wallet = window.solana;
    // Handle both cases where response might be the public key or an object containing it
    const pk = response.publicKey || response;
    this._publicKey = typeof pk === 'string' ? new PublicKey(pk) : pk;

    if (this._publicKey) {
      console.log("✅ Phantom connected:", this._publicKey.toString());
    }
    
    if (!this._publicKey) {
      throw new Error("Public key is null after connection.");
    }
    return { publicKey: this._publicKey.toString() };
  }

  disconnect() {
    if (this._wallet?.disconnect) this._wallet.disconnect();
    this._wallet = null;
    this._publicKey = null;
  }

  isConnected() {
    return !!this._publicKey;
  }

  getWalletObject() {
    if (!this._wallet || !this._publicKey) {
      throw new Error("Wallet not connected");
    }
    return {
      publicKey: this._publicKey,
      sendTransaction: async (tx: Transaction, connection: Connection) => {
        // Modern Phantom signAndSendTransaction only takes the transaction
        const { signature } = await window.solana?.signAndSendTransaction(tx);
        return signature;
      },
    };
  }

  getPublicKey() {
    return this._publicKey;
  }
}

export const walletConnection = WalletConnection.getInstance();
