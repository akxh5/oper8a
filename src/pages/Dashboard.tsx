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
    if (elo >= 2750) return 'text-emerald-400';
    if (elo >= 2650) return 'text-purple-400';
    if (elo >= 2600) return 'text-yellow-400';
    return 'text-red-500';
  };

  const getEloRank = (elo: number) => {
    if (elo >= 2750) return 'MASTER';
    if (elo >= 2650) return 'EXPERT';
    if (elo >= 2600) return 'ADVANCED';
    return 'NOVICE';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#0a0a0a] to-[#16213e] text-white relative">
      {/* Neo-Brutalism Grid Background */}
      <div className="absolute inset-0 brutal-grid opacity-20"></div>
      
      {/* Header */}
      <div className="border-b-4 border-emerald-400 bg-black backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-emerald-400 border-4 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center">
                  <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-black neon-text font-mono tracking-wider uppercase">
                  OPER8A DASHBOARD
                </h1>
                <p className="text-xs text-emerald-400 font-mono uppercase tracking-widest">
                  BLOCKCHAIN VERIFIED
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              {/* ELO Display */}
              <div className="brutal-card bg-black border-4 border-emerald-400 shadow-[4px_4px_0px_0px_#00ff88] px-3 sm:px-4 py-2">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="text-center">
                    <div className={`text-sm sm:text-xl font-black ${getEloColor(userElo)} font-mono`}>
                      {userElo}
                    </div>
                    <div className="text-xs text-emerald-400 font-mono uppercase tracking-wider">ELO</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs sm:text-sm font-black ${getEloColor(userElo)} font-mono uppercase`}>
                      {getEloRank(userElo)}
                    </div>
                    <div className="text-xs text-emerald-400 font-mono uppercase tracking-wider">RANK</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-gray-300 w-full sm:w-auto">
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button className="brutal-button-secondary p-2 w-10 h-10" aria-label="Settings">
                      <SettingsIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg w-full bg-black border-4 border-emerald-400 shadow-[8px_8px_0px_0px_#00ff88] text-white">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-3 text-2xl font-black uppercase tracking-wider">
                        <div className="w-8 h-8 bg-emerald-400 border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center">
                          <SettingsIcon className="w-4 h-4 text-black" />
                        </div>
                        <span>IPFS CONFIGURATION</span>
                      </DialogTitle>
                    </DialogHeader>
                    {/* IPFS Configuration Panel */}
                    <Card className="brutal-card bg-gray-900 border-2 border-gray-600 shadow-[4px_4px_0px_0px_#333333]">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-600 border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] flex items-center justify-center">
                            <Key className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white font-black uppercase tracking-wider">PINATA API KEYS</CardTitle>
                            <CardDescription className="text-gray-300 font-mono text-xs uppercase tracking-wide">
                              {hasApiKeys ? 'UPDATE YOUR PINATA CREDENTIALS' : 'CONFIGURE PINATA IPFS STORAGE'}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="api-key" className="text-white font-bold uppercase tracking-wider">API KEY</Label>
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
                          <Label htmlFor="secret-key" className="text-white font-bold uppercase tracking-wider">SECRET KEY</Label>
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
                          className="w-full brutal-button font-black uppercase tracking-wider"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
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
                    <Button className="brutal-button-secondary px-2 sm:px-3 py-1 h-auto text-xs sm:text-sm font-bold uppercase tracking-wider">
                      <Wallet className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                      <span className="truncate max-w-[100px] sm:max-w-none">{walletAddress}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black border-2 border-emerald-400 shadow-[4px_4px_0px_0px_#00ff88] text-white">
                    <DropdownMenuItem onClick={handleCopyAddress} className="hover:bg-emerald-400/20 font-mono uppercase tracking-wide">
                      <Copy className="w-4 h-4 mr-2" />
                      COPY ADDRESS
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-emerald-400" />
                    <DropdownMenuItem onClick={handleChangeWallet} className="hover:bg-emerald-400/20 font-mono uppercase tracking-wide">
                      <Wallet className="w-4 h-4 mr-2" />
                      CHANGE WALLET
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDisconnect} className="hover:bg-red-400/20 text-red-400 font-mono uppercase tracking-wide">
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
            <Card className="brutal-card bg-black border-4 border-emerald-400 shadow-[6px_6px_0px_0px_#00ff88]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] flex items-center justify-center">
                    <Database className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white font-black uppercase tracking-wider">NETWORK</CardTitle>
                    <CardDescription className="text-gray-300 font-mono text-xs uppercase tracking-wide">
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
            <Card className="brutal-card bg-black border-4 border-emerald-400 shadow-[6px_6px_0px_0px_#00ff88]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-400 border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center">
                    <Upload className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <CardTitle className="text-white font-black uppercase tracking-wider">UPLOAD FILE</CardTitle>
                    <CardDescription className="text-gray-300 font-mono text-xs uppercase tracking-wide">
                      {selectedNetwork 
                        ? `UPLOAD FILES TO ${selectedNetwork.name.toUpperCase()} NETWORK WITH BLOCKCHAIN TRACKING`
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
              <Card className="brutal-card bg-black border-4 border-purple-600 shadow-[6px_6px_0px_0px_#7209b7]">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] flex items-center justify-center">
                      <Database className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base sm:text-lg font-black uppercase tracking-wider">NETWORK MEMBERS</CardTitle>
                      <CardDescription className="text-gray-300 text-sm font-mono uppercase tracking-wide">
                        MEMBERS IN THE SELECTED NETWORK
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-2 sm:px-4">
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
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
            <Card className="brutal-card bg-black border-4 border-emerald-400 shadow-[6px_6px_0px_0px_#00ff88]">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-400 border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center">
                      <Database className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base sm:text-lg font-black uppercase tracking-wider">PERSONAL FILES</CardTitle>
                      <CardDescription className="text-gray-300 text-sm font-mono uppercase tracking-wide">
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
                      className="brutal-button-secondary whitespace-nowrap font-bold uppercase tracking-wider"
                    >
                      <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">REFRESH</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-2 px-2 sm:px-4">
                <div className="max-h-[400px] sm:max-h-[560px] min-h-[300px] sm:min-h-[400px] overflow-y-auto custom-scrollbar">
                  <FileRecords 
                    refreshTrigger={refreshTrigger} 
                    userWallet={fullWalletAddress}
                    maxFiles={10}
                    search={personalFilesSearch}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="brutal-card bg-black border-4 border-purple-600 shadow-[6px_6px_0px_0px_#7209b7]">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] flex items-center justify-center">
                      <Database className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base sm:text-lg font-black uppercase tracking-wider">NETWORK FILES</CardTitle>
                      <CardDescription className="text-gray-300 text-sm font-mono uppercase tracking-wide">
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
                      className="brutal-button-secondary whitespace-nowrap font-bold uppercase tracking-wider"
                    >
                      <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">REFRESH</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-2 px-2 sm:px-4">
                <div className="max-h-[400px] sm:max-h-[560px] min-h-[300px] sm:min-h-[400px] overflow-y-auto custom-scrollbar">
                  {selectedNetwork ? (
                    <NetworkFilesList 
                      network={selectedNetwork} 
                      userWallet={fullWalletAddress}
                      refreshTrigger={refreshTrigger}
                      search={networkFilesSearch}
                    />
                  ) : (
                    <div className="text-gray-400 p-4 text-center text-sm font-mono uppercase tracking-wide">SELECT A NETWORK TO VIEW FILES.</div>
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
