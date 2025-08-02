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
    if (elo >= 2750) return 'text-neo-green';
    if (elo >= 2650) return 'text-neo-blue';
    if (elo >= 2600) return 'text-neo-yellow';
    return 'text-neo-red';
  };

  const getEloRank = (elo: number) => {
    if (elo >= 2750) return 'Master';
    if (elo >= 2650) return 'Expert';
    if (elo >= 2600) return 'Advanced';
    return 'Novice';
  };

  return (
    <div className="min-h-screen bg-neo-cream text-neo-black">
      {/* Neo-Brutalism background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-20 h-20 bg-neo-red transform rotate-12 border-3 border-neo-black shadow-neo-lg"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-neo-blue transform rotate-[-25deg] border-3 border-neo-black shadow-neo"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-neo-yellow transform rotate-45 border-3 border-neo-black shadow-neo-lg"></div>
        <div className="absolute bottom-1/3 right-10 w-14 h-14 bg-neo-green transform rotate-[-15deg] border-3 border-neo-black shadow-neo"></div>
        <div className="absolute top-2/3 left-10 w-18 h-18 bg-neo-purple transform rotate-30 border-3 border-neo-black shadow-neo-xl"></div>
      </div>

      {/* Header */}
      <div className="border-b-4 border-neo-black bg-neo-yellow shadow-neo relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="relative bg-neo-cyan border-3 border-neo-black p-2 transform rotate-[-3deg] shadow-neo">
                <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-neo-black" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neo-black transform rotate-[1deg]">
                Oper8a Dashboard
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              {/* ELO Display */}
              <div className="bg-neo-white border-3 border-neo-black px-3 sm:px-4 py-2 shadow-neo transform rotate-[-1deg]">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="text-center">
                    <div className={`text-sm sm:text-lg font-black ${getEloColor(userElo)}`}>
                      {userElo}
                    </div>
                    <div className="text-xs font-bold text-neo-charcoal">ELO</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs sm:text-sm font-black ${getEloColor(userElo)}`}>
                      {getEloRank(userElo)}
                    </div>
                    <div className="text-xs font-bold text-neo-charcoal">Rank</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-neo-black w-full sm:w-auto">
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="p-2 bg-neo-orange border-3 border-neo-black shadow-neo hover:shadow-neo-lg transform rotate-[2deg] hover:rotate-0" aria-label="Settings">
                      <SettingsIcon className="w-4 sm:w-5 h-4 sm:h-5 text-neo-black" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg w-full bg-neo-white border-4 border-neo-black text-neo-black shadow-neo-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2 font-black">
                        <SettingsIcon className="w-5 h-5 text-neo-purple" />
                        <span>IPFS Configuration</span>
                      </DialogTitle>
                    </DialogHeader>
                    {/* IPFS Configuration Panel */}
                    <Card className="bg-neo-beige border-neo-black shadow-neo border-3">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Key className="w-6 h-6 text-neo-orange" />
                          <div>
                            <CardTitle className="text-neo-black">Pinata API Keys</CardTitle>
                            <CardDescription className="text-neo-charcoal">
                              {hasApiKeys ? 'Update your Pinata credentials' : 'Configure Pinata IPFS storage'}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="api-key" className="text-neo-black font-bold">API Key</Label>
                          <Input
                            id="api-key"
                            type="password"
                            placeholder="Enter your Pinata API key"
                            value={pinataApiKey}
                            onChange={(e) => setPinataApiKey(e.target.value)}
                            className="bg-neo-white border-neo-black text-neo-black placeholder:text-neo-charcoal"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secret-key" className="text-neo-black font-bold">Secret Key</Label>
                          <Input
                            id="secret-key"
                            type="password"
                            placeholder="Enter your Pinata secret key"
                            value={pinataSecretKey}
                            onChange={(e) => setPinataSecretKey(e.target.value)}
                            className="bg-neo-white border-neo-black text-neo-black placeholder:text-neo-charcoal"
                          />
                        </div>
                        <Button 
                          onClick={handleSaveApiKeys}
                          disabled={isLoading || !pinataApiKey || !pinataSecretKey}
                          className="w-full bg-neo-orange border-neo-black text-neo-white hover:bg-neo-red"
                          variant="brutal"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Testing Connection...
                            </>
                          ) : hasApiKeys ? (
                            'Update API Keys'
                          ) : (
                            'Save API Keys'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </Dialog>
                <span className="hidden sm:inline font-black">Connected:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-neo-black hover:text-neo-black bg-neo-cyan border-3 border-neo-black px-2 sm:px-3 py-1 h-auto text-xs sm:text-sm shadow-neo hover:shadow-neo-lg transform rotate-[-1deg] hover:rotate-0">
                      <Wallet className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                      <span className="truncate max-w-[100px] sm:max-w-none font-bold">{walletAddress}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-neo-white border-3 border-neo-black text-neo-black shadow-neo-xl">
                    <DropdownMenuItem onClick={handleCopyAddress} className="hover:bg-neo-yellow font-bold">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-neo-black" />
                    <DropdownMenuItem onClick={handleChangeWallet} className="hover:bg-neo-blue hover:text-neo-white font-bold">
                      <Wallet className="w-4 h-4 mr-2" />
                      Change Wallet
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDisconnect} className="hover:bg-neo-red hover:text-neo-white text-neo-red font-bold">
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
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
            <Card className="bg-neo-white border-neo-black shadow-neo-lg transform rotate-[-1deg] hover:rotate-0 transition-all duration-300 hover:shadow-neo-xl">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Database className="w-6 h-6 text-neo-blue" />
                  <div>
                    <CardTitle className="text-neo-black">Network</CardTitle>
                    <CardDescription className="text-neo-charcoal">
                      Manage and select your network
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
                />
              </CardContent>
            </Card>
            <Card className="bg-neo-white border-neo-black shadow-neo-lg transform rotate-[1deg] hover:rotate-0 transition-all duration-300 hover:shadow-neo-xl">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Upload className="w-6 h-6 text-neo-green" />
                  <div>
                    <CardTitle className="text-neo-black">Upload File</CardTitle>
                    <CardDescription className="text-neo-charcoal">
                      {selectedNetwork 
                        ? `Upload files to ${selectedNetwork.name} network with blockchain tracking`
                        : 'Upload files to your personal storage'
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
              <Card className="bg-neo-white border-neo-black shadow-neo-lg transform rotate-[-2deg] hover:rotate-0 transition-all duration-300 hover:shadow-neo-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 sm:w-6 h-5 sm:h-6 text-neo-yellow" />
                    <div>
                      <CardTitle className="text-neo-black text-base sm:text-lg">Network Members</CardTitle>
                      <CardDescription className="text-neo-charcoal text-sm">
                        Members in the selected network
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
            <Card className="bg-neo-white border-neo-black shadow-neo-lg transform rotate-[1deg] hover:rotate-0 transition-all duration-300 hover:shadow-neo-xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 sm:w-6 h-5 sm:h-6 text-neo-purple" />
                    <div>
                      <CardTitle className="text-neo-black text-base sm:text-lg">Personal Files</CardTitle>
                      <CardDescription className="text-neo-charcoal text-sm">
                        Files stored on IPFS via Pinata with blockchain metadata
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={personalFilesSearch}
                      onChange={e => setPersonalFilesSearch(e.target.value)}
                      placeholder="Search..."
                      className="bg-neo-white border-3 border-neo-black px-2 py-1 text-sm text-neo-black focus:outline-none focus:border-neo-purple placeholder:text-neo-charcoal flex-1 sm:w-32 font-bold shadow-neo transform rotate-[-1deg] focus:rotate-0 transition-all duration-200"
                    />
                    <Button 
                      onClick={handleRefreshFiles}
                      variant="outline" 
                      size="sm"
                      className="border-neo-black bg-neo-cyan text-neo-black hover:bg-neo-blue hover:text-neo-white border-3 shadow-neo whitespace-nowrap transform rotate-[1deg] hover:rotate-0"
                    >
                      <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline font-bold">Refresh</span>
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
            <Card className="bg-neo-white border-neo-black shadow-neo-lg transform rotate-[-1deg] hover:rotate-0 transition-all duration-300 hover:shadow-neo-xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 sm:w-6 h-5 sm:h-6 text-neo-cyan" />
                    <div>
                      <CardTitle className="text-neo-black text-base sm:text-lg">Network Files</CardTitle>
                      <CardDescription className="text-neo-charcoal text-sm">
                        Files shared in the selected network
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={networkFilesSearch}
                      onChange={e => setNetworkFilesSearch(e.target.value)}
                      placeholder="Search..."
                      className="bg-neo-white border-3 border-neo-black px-2 py-1 text-sm text-neo-black focus:outline-none focus:border-neo-purple placeholder:text-neo-charcoal flex-1 sm:w-32 font-bold shadow-neo transform rotate-[1deg] focus:rotate-0 transition-all duration-200"
                    />
                    <Button 
                      onClick={handleRefreshFiles}
                      variant="outline" 
                      size="sm"
                      className="border-neo-black bg-neo-cyan text-neo-black hover:bg-neo-blue hover:text-neo-white border-3 shadow-neo whitespace-nowrap transform rotate-[-1deg] hover:rotate-0"
                    >
                      <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline font-bold">Refresh</span>
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
                    <div className="text-neo-charcoal p-4 text-center text-sm font-bold bg-neo-beige border-3 border-neo-black shadow-neo transform rotate-[-1deg]">Select a network to view files.</div>
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
