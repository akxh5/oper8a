import StorageAnalytics from '../components/StorageAnalytics';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Upload, RefreshCw, ExternalLink, Key, Database, Copy, LogOut, Wallet, Settings as SettingsIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import FileUpload from '../components/FileUpload';
import FileRecords from '../components/FileRecords';
import NetworkManager from '../components/NetworkManager';
import NetworkFiles from '../components/NetworkFiles';
import NetworkMembers from '../components/NetworkMembers';
import NetworkFilesList from '../components/NetworkFilesList';
import NetworkSettings from '../components/NetworkSettings';
import { getPinataKeys, savePinataKeys, testPinataConnection } from '../utils/pinataUtils';
import { Network, getUserElo, updateUserElo } from '../utils/networkUtils';
import DuplicateAlerts from '../components/DuplicateAlerts';

const Dashboard = () => {
  const [pinataApiKey, setPinataApiKey] = useState('');
  const [pinataSecretKey, setPinataSecretKey] = useState('');
  const [hasApiKeys, setHasApiKeys] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>();
  const [username, setUsername] = useState('User123'); // In real app, get from wallet or user input
  const [userElo, setUserElo] = useState(2701); // ELO rating from Firebase
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [personalFilesSearch, setPersonalFilesSearch] = useState("");
  const [networkFilesSearch, setNetworkFilesSearch] = useState("");

  const walletAddress = localStorage.getItem('walletAddress') || '7xKs...9mP2';
  const fullWalletAddress = localStorage.getItem('walletAddress') || '7xKs9mP2Zn4yQ8vR3pL6wX1cA5bE9fH2jK7nM4qS8tV9';

  // Check for existing API keys on component mount and load user ELO
  useEffect(() => {
    const { apiKey, secretKey } = getPinataKeys();
    if (apiKey && secretKey) {
      setHasApiKeys(true);
      setPinataApiKey(apiKey);
      setPinataSecretKey(secretKey);
    }
    
    // Load user ELO from Firebase
    const loadUserElo = async () => {
      if (fullWalletAddress) {
        try {
          const elo = await getUserElo(fullWalletAddress);
          setUserElo(elo);
        } catch (error) {
          console.error('Failed to load user ELO:', error);
        }
      }
    };
    
    loadUserElo();
  }, [fullWalletAddress]);

  const handleSaveApiKeys = async () => {
    setIsLoading(true);
    console.log('Testing and saving API keys...', { pinataApiKey: pinataApiKey.substring(0, 8) + '...' });
    
    try {
      // Test the connection first
      const isValid = await testPinataConnection(pinataApiKey, pinataSecretKey);
      
      if (!isValid) {
        alert('Invalid API keys. Please check your Pinata credentials.');
        setIsLoading(false);
        return;
      }
      
      // Save to localStorage
      savePinataKeys(pinataApiKey, pinataSecretKey);
      setHasApiKeys(true);
      alert('API keys saved successfully and tested!');
      
      // Trigger file refresh
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving API keys:', error);
      alert('Failed to save API keys. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshFiles = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFileUploaded = async () => {
    // Refresh file list after successful upload
    setRefreshTrigger(prev => prev + 1);
    
    // Refresh user ELO after file upload
    if (fullWalletAddress) {
      try {
        const updatedElo = await getUserElo(fullWalletAddress);
        setUserElo(updatedElo);
      } catch (error) {
        console.error('Failed to refresh user ELO:', error);
      }
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullWalletAddress);
    alert('Wallet address copied to clipboard!');
  };

  const handleChangeWallet = async () => {
    console.log('Changing wallet...');
    try {
      const { walletConnection } = await import('../utils/walletConnection');
      await walletConnection.disconnect();
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAddress');
      window.location.href = '/';
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      window.location.href = '/';
    }
  };

  const handleDisconnect = async () => {
    console.log('Disconnecting wallet...');
    try {
      const { walletConnection } = await import('../utils/walletConnection');
      await walletConnection.disconnect();
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAddress');
      window.location.href = '/';
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      window.location.href = '/';
    }
  };

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    console.log('Selected network:', network.name);
  };

  const getEloColor = (elo: number) => {
    if (elo >= 2750) return 'text-mint-green';
    if (elo >= 2650) return 'text-sky-blue';
    if (elo >= 2600) return 'text-warm-peach';
    return 'text-soft-coral';
  };

  const getEloRank = (elo: number) => {
    if (elo >= 2750) return 'MASTER';
    if (elo >= 2650) return 'EXPERT';
    if (elo >= 2600) return 'ADVANCED';
    return 'NOVICE';
  };

  return (
    <div className="brutal-layout">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 brutal-bg-pattern"></div>
      
      {/* Header */}
      <div className="brutal-header relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="brutal-icon-box w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center">
                  <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-charcoal" />
                </div>
              </div>
              <div>
                <h1 className="brutal-heading text-xl sm:text-3xl">
                  OPER8A DASHBOARD
                </h1>
                <p className="brutal-mono text-xs text-mint-green">
                  BLOCKCHAIN VERIFIED
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              {/* ELO Display */}
              <div className="brutal-card px-3 sm:px-4 py-2">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="text-center">
                    <div className={`brutal-heading text-sm sm:text-xl ${getEloColor(userElo)}`}>
                      {userElo}
                    </div>
                    <div className="brutal-mono text-xs text-mint-green">ELO</div>
                  </div>
                  <div className="text-center">
                    <div className={`brutal-heading text-xs sm:text-sm ${getEloColor(userElo)}`}>
                      {getEloRank(userElo)}
                    </div>
                    <div className="brutal-mono text-xs text-mint-green">RANK</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-gray-300 w-full sm:w-auto">
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button className="brutal-button-blue p-2 w-10 h-10" aria-label="Settings">
                      <SettingsIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg w-full brutal-modal">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-3 brutal-heading text-2xl">
                        <div className="brutal-icon-box w-8 h-8 flex items-center justify-center">
                          <SettingsIcon className="w-4 h-4 text-charcoal" />
                        </div>
                        <span>IPFS CONFIGURATION</span>
                      </DialogTitle>
                    </DialogHeader>
                    {/* IPFS Configuration Panel */}
                    <Card className="brutal-form">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="brutal-icon-box w-8 h-8 flex items-center justify-center">
                            <Key className="w-4 h-4 text-charcoal" />
                          </div>
                          <div>
                            <CardTitle className="brutal-heading">PINATA API KEYS</CardTitle>
                            <CardDescription className="brutal-mono text-xs">
                              {hasApiKeys ? 'UPDATE YOUR PINATA CREDENTIALS' : 'CONFIGURE PINATA IPFS STORAGE'}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="api-key" className="brutal-label">API KEY</Label>
                          <Input
                            id="api-key"
                            type="password"
                            placeholder="ENTER YOUR PINATA API KEY"
                            value={pinataApiKey}
                            onChange={(e) => setPinataApiKey(e.target.value)}
                            className="brutal-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secret-key" className="brutal-label">SECRET KEY</Label>
                          <Input
                            id="secret-key"
                            type="password"
                            placeholder="ENTER YOUR PINATA SECRET KEY"
                            value={pinataSecretKey}
                            onChange={(e) => setPinataSecretKey(e.target.value)}
                            className="brutal-input"
                          />
                        </div>
                        <Button 
                          onClick={handleSaveApiKeys}
                          disabled={isLoading || !pinataApiKey || !pinataSecretKey}
                          className="w-full brutal-button"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              TESTING CONNECTION...
                            </>
                          ) : hasApiKeys ? (
                            'UPDATE API KEYS'
                          ) : (
                            'SAVE API KEYS'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </Dialog>
                <span className="hidden sm:inline">Connected:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="brutal-button-lavender px-2 sm:px-3 py-1 h-auto text-xs sm:text-sm">
                      <Wallet className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                      <span className="truncate max-w-[100px] sm:max-w-none">{walletAddress}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="brutal-card">
                    <DropdownMenuItem onClick={handleCopyAddress} className="brutal-mono hover:bg-soft-gray">
                      <Copy className="w-4 h-4 mr-2" />
                      COPY ADDRESS
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="brutal-border" />
                    <DropdownMenuItem onClick={handleChangeWallet} className="brutal-mono hover:bg-soft-gray">
                      <Wallet className="w-4 h-4 mr-2" />
                      CHANGE WALLET
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDisconnect} className="brutal-mono hover:bg-soft-coral text-charcoal">
                      <LogOut className="w-4 h-4 mr-2" />
                      DISCONNECT
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left: Network Manager, Upload File, Network Members (stacked, ~5/12 width) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            <Card className="brutal-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="brutal-icon-box w-8 h-8 flex items-center justify-center">
                    <Database className="w-4 h-4 text-charcoal" />
                  </div>
                  <div>
                    <CardTitle className="brutal-heading">NETWORK</CardTitle>
                    <CardDescription className="brutal-mono text-xs">
                      MANAGE AND SELECT YOUR NETWORK
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <NetworkManager
                  userWallet={fullWalletAddress}
                  username={username}
                  onNetworkSelect={handleNetworkSelect}
                  selectedNetwork={selectedNetwork}
                  scrollIfMany={true}
                />
              </CardContent>
            </Card>
            <Card className="brutal-card-peach">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="brutal-icon-box w-8 h-8 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-charcoal" />
                  </div>
                  <div>
                    <CardTitle className="brutal-heading">UPLOAD FILE</CardTitle>
                    <CardDescription className="brutal-mono text-xs">
                      {selectedNetwork 
                        ? `UPLOAD TO ${selectedNetwork.name.toUpperCase()} NETWORK`
                        : 'UPLOAD FILES TO YOUR PERSONAL STORAGE'
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  hasApiKeys={hasApiKeys} 
                  onFileUploaded={handleFileUploaded}
                  selectedNetwork={selectedNetwork}
                  userWallet={fullWalletAddress}
                  username={username}
                />
              </CardContent>
            </Card>
            {/* Network Members */}
            {selectedNetwork && (
              <Card className="brutal-card-lavender">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="brutal-icon-box w-8 h-8 flex items-center justify-center">
                      <Database className="w-4 h-4 text-charcoal" />
                    </div>
                    <div>
                      <CardTitle className="brutal-heading text-base sm:text-lg">NETWORK MEMBERS</CardTitle>
                      <CardDescription className="brutal-mono text-sm">
                        MEMBERS IN THE SELECTED NETWORK
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-2 sm:px-4">
                  <div className="max-h-[300px] overflow-y-auto brutal-scrollbar">
                    <NetworkMembers 
                      network={selectedNetwork} 
                      userWallet={fullWalletAddress}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Network Settings */}
            {selectedNetwork && (
              <NetworkSettings 
                network={selectedNetwork} 
                userWallet={fullWalletAddress}
                onNetworkLeft={() => {
                  setSelectedNetwork(undefined);
                  setRefreshTrigger(prev => prev + 1);
                }}
              />
            )}
          </div>

          {/* Right: Personal Files, Network Files (stacked, ~7/12 width) */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
            <Card className="brutal-card-blue">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="brutal-icon-box w-8 h-8 flex items-center justify-center">
                      <Database className="w-4 h-4 text-charcoal" />
                    </div>
                    <div>
                      <CardTitle className="brutal-heading text-base sm:text-lg">PERSONAL FILES</CardTitle>
                      <CardDescription className="brutal-mono text-sm">
                        FILES STORED ON IPFS VIA PINATA WITH BLOCKCHAIN METADATA
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={personalFilesSearch}
                      onChange={e => setPersonalFilesSearch(e.target.value)}
                      placeholder="SEARCH..."
                      className="brutal-input flex-1 sm:w-32 text-sm"
                      style={{ transition: 'border 0.2s' }}
                    />
                    <Button 
                      onClick={handleRefreshFiles}
                      variant="outline" 
                      size="sm"
                      className="brutal-button-secondary whitespace-nowrap"
                    >
                      <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">REFRESH</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-2 px-2 sm:px-4">
                <div className="max-h-[400px] sm:max-h-[560px] min-h-[300px] sm:min-h-[400px] overflow-y-auto brutal-scrollbar">
                  <FileRecords 
                    refreshTrigger={refreshTrigger} 
                    userWallet={fullWalletAddress}
                    maxFiles={10}
                    search={personalFilesSearch}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="brutal-card-coral">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="brutal-icon-box w-8 h-8 flex items-center justify-center">
                      <Database className="w-4 h-4 text-charcoal" />
                    </div>
                    <div>
                      <CardTitle className="brutal-heading text-base sm:text-lg">NETWORK FILES</CardTitle>
                      <CardDescription className="brutal-mono text-sm">
                        FILES SHARED IN THE SELECTED NETWORK
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={networkFilesSearch}
                      onChange={e => setNetworkFilesSearch(e.target.value)}
                      placeholder="SEARCH..."
                      className="brutal-input flex-1 sm:w-32 text-sm"
                      style={{ transition: 'border 0.2s' }}
                    />
                    <Button 
                      onClick={handleRefreshFiles}
                      variant="outline" 
                      size="sm"
                      className="brutal-button-secondary whitespace-nowrap"
                    >
                      <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">REFRESH</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-2 px-2 sm:px-4">
                <div className="max-h-[400px] sm:max-h-[560px] min-h-[300px] sm:min-h-[400px] overflow-y-auto brutal-scrollbar">
                  {selectedNetwork ? (
                    <NetworkFilesList 
                      network={selectedNetwork} 
                      userWallet={fullWalletAddress}
                      refreshTrigger={refreshTrigger}
                      search={networkFilesSearch}
                    />
                  ) : (
                    <div className="brutal-text-block text-center">
                      <p className="brutal-mono text-sm">SELECT A NETWORK TO VIEW FILES</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;