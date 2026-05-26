"use client"
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, getDocs, orderBy } from 'firebase/firestore'

export interface Network {
  id: string
  name: string
  adminWallet: string
  joinKey: string
  members: any[]
  createdAt: any
}

interface AppContextType {
  walletAddress: string | null
  setWalletAddress: (addr: string | null) => void
  selectedNetwork: Network | null
  setSelectedNetwork: (n: Network | null) => void
  networks: Network[]
  setNetworks: (n: Network[]) => void
  pinataConfigured: boolean
  setPinataConfigured: (v: boolean) => void
  refreshTick: number
  refreshFiles: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [networks, setNetworks] = useState<Network[]>([])
  const [pinataConfigured, setPinataConfigured] = useState(false)
  const [refreshTick, setRefreshTick] = useState(0)

  const refreshFiles = useCallback(() => {
    setRefreshTick(prev => prev + 1)
  }, [])

  // HYDRATE FROM LOCALSTORAGE ON MOUNT
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress')
    const savedConnected = localStorage.getItem('walletConnected')
    const savedPinataKey = localStorage.getItem('pinata_api_key')
    
    if (savedAddress && savedConnected === 'true') {
      setWalletAddress(savedAddress)
    }
    
    if (savedPinataKey) {
      setPinataConfigured(true)
    }
  }, [])

  // LOAD NETWORKS FROM FIREBASE WHEN WALLET IS SET
  useEffect(() => {
    if (!walletAddress) return
    
    const loadNetworks = async () => {
      try {
        const networksRef = collection(db, 'networks')
        // Get all networks and filter client side for maximum reliability
        const allNetworksQ = query(networksRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(allNetworksQ)
        
        const userNetworks = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Network))
          .filter(network => 
            network.members?.some((m: any) => m.walletAddress === walletAddress)
          )
        
        setNetworks(userNetworks)
        
        // Auto-select first network if none selected
        if (userNetworks.length > 0 && !selectedNetwork) {
          setSelectedNetwork(userNetworks[0])
        }
      } catch (err) {
        console.warn('Failed to load networks:', err)
      }
    }
    
    loadNetworks()
  }, [walletAddress, refreshTick])

  return (
    <AppContext.Provider value={{
      walletAddress, setWalletAddress,
      selectedNetwork, setSelectedNetwork,
      networks, setNetworks,
      pinataConfigured, setPinataConfigured,
      refreshTick, refreshFiles
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
