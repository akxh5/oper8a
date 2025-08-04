
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Key, Crown, Copy, UserPlus } from 'lucide-react';
import { createNetwork, joinNetwork, getUserNetworks, Network } from '../utils/networkUtils';

interface NetworkManagerProps {
  userWallet: string;
  username: string;
  onNetworkSelect: (network: Network) => void;
  selectedNetwork?: Network;
}

const NetworkManager: React.FC<NetworkManagerProps> = ({ 
  userWallet, 
  username, 
  onNetworkSelect, 
  selectedNetwork 
}) => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [newNetworkName, setNewNetworkName] = useState('');
  const [joinNetworkName, setJoinNetworkName] = useState('');
  const [joinKey, setJoinKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserNetworks();
  }, [userWallet]);

  const loadUserNetworks = async () => {
    try {
      const userNetworks = await getUserNetworks(userWallet);
      setNetworks(userNetworks);
      
      // Auto-select first network if none selected
      if (!selectedNetwork && userNetworks.length > 0) {
        onNetworkSelect(userNetworks[0]);
      }
    } catch (error) {
      console.error('Failed to load user networks:', error);
    }
  };

  const handleCreateNetwork = async () => {
    if (!newNetworkName.trim()) return;
    
    setIsLoading(true);
    try {
      const network = await createNetwork(newNetworkName, userWallet, username);
      console.log('Network created:', network);
      
      await loadUserNetworks();
      onNetworkSelect(network);
      setNewNetworkName('');
      setShowCreateForm(false);
      
      alert(`Network "${network.name}" created successfully!\nJoin Key: ${network.joinKey}`);
    } catch (error) {
      console.error('Error creating network:', error);
      alert('Failed to create network');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinNetwork = async () => {
    if (!joinNetworkName.trim() || !joinKey.trim()) return;
    
    setIsLoading(true);
    try {
      const network = await joinNetwork(joinNetworkName, joinKey, userWallet, username);
      console.log('Joined network:', network);
      
      if (network) {
        await loadUserNetworks();
        onNetworkSelect(network);
        setJoinNetworkName('');
        setJoinKey('');
        setShowJoinForm(false);
        
        alert(`Successfully joined network "${network.name}"!`);
      }
    } catch (error) {
      console.error('Error joining network:', error);
      alert(error instanceof Error ? error.message : 'Failed to join network');
    } finally {
      setIsLoading(false);
    }
  };

  const copyJoinKey = (network: Network) => {
    navigator.clipboard.writeText(network.joinKey);
    alert('Join key copied to clipboard!');
  };

  const isAdmin = (network: Network) => {
    return network.adminWallet === userWallet;
  };

  return (
    <Card className="brutal-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="brutal-icon-box w-6 h-6 flex items-center justify-center">
              <Users className="w-4 h-4 text-charcoal" />
            </div>
            <div>
              <CardTitle className="brutal-heading text-base sm:text-lg">Networks</CardTitle>
              <CardDescription className="brutal-body text-sm">
                Create or join networks to collaborate on file sharing
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto justify-end">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="sm"
              className="brutal-button"
            >
              <Plus className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Create</span>
            </Button>
            <Button
              onClick={() => setShowJoinForm(!showJoinForm)}
              size="sm"
              variant="outline"
              className="brutal-button-blue"
            >
              <UserPlus className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Join</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Create Network Form */}
        {showCreateForm && (
          <div className="brutal-form-group space-y-3">
            <Label htmlFor="network-name" className="brutal-label">Network Name</Label>
            <Input
              id="network-name"
              placeholder="Enter network name"
              value={newNetworkName}
              onChange={(e) => setNewNetworkName(e.target.value)}
              className="brutal-input"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleCreateNetwork}
                disabled={!newNetworkName.trim() || isLoading}
                className="brutal-button"
              >
                {isLoading ? 'Creating...' : 'Create Network'}
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="brutal-button-secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Join Network Form */}
        {showJoinForm && (
          <div className="brutal-form-group space-y-3">
            <div>
              <Label htmlFor="join-network-name" className="brutal-label">Network Name</Label>
              <Input
                id="join-network-name"
                placeholder="Enter network name"
                value={joinNetworkName}
                onChange={(e) => setJoinNetworkName(e.target.value)}
                className="brutal-input"
              />
            </div>
            <div>
              <Label htmlFor="join-key" className="brutal-label">Join Key</Label>
              <Input
                id="join-key"
                placeholder="Enter join key provided by admin"
                value={joinKey}
                onChange={(e) => setJoinKey(e.target.value)}
                className="brutal-input"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleJoinNetwork}
                disabled={!joinNetworkName.trim() || !joinKey.trim() || isLoading}
                className="brutal-button-coral"
              >
                {isLoading ? 'Joining...' : 'Join Network'}
              </Button>
              <Button
                onClick={() => setShowJoinForm(false)}
                variant="outline"
                className="brutal-button-secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Networks List with Search */}
        <div className={networks.length > 4 ? "brutal-list max-h-[260px] overflow-y-auto brutal-scrollbar" : "brutal-list"}>
          {networks.length === 0 ? (
            <div className="brutal-text-block text-center py-8">
              <div className="brutal-icon-box w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-charcoal" />
              </div>
              <p className="brutal-subheading">No networks found</p>
              <p className="brutal-body text-sm">Create or join a network to get started</p>
            </div>
          ) : (
            networks.map((network) => (
              <div 
                key={network.id}
                className={`brutal-list-item cursor-pointer transition-colors ${
                  selectedNetwork?.id === network.id
                    ? 'brutal-shadow-blue'
                    : 'hover:brutal-shadow-mint'
                }`}
                onClick={() => onNetworkSelect(network)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="brutal-subheading">{network.name}</h3>
                      {isAdmin(network) && (
                        <div className="brutal-badge">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </div>
                      )}
                    </div>
                    <p className="brutal-body text-sm">
                      {network.members.length} member{network.members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {isAdmin(network) && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyJoinKey(network);
                      }}
                      size="sm"
                      variant="ghost"
                      className="brutal-button-secondary"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Key
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkManager;
