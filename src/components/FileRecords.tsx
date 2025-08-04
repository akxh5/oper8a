
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { File, ExternalLink, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { FileRecord, fetchPinataFiles } from '../utils/pinataUtils';

interface FileRecordsProps {
  refreshTrigger?: number;
  userWallet: string;
  maxFiles?: number;
  search?: string;
}

const FileRecords: React.FC<FileRecordsProps> = ({ refreshTrigger, userWallet, maxFiles, search }) => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading files from Pinata...');
      const pinataFiles = await fetchPinataFiles();
      setFiles(pinataFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      setError(error instanceof Error ? error.message : 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [refreshTrigger, userWallet]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-mint-green" />;
      case 'duplicate':
        return <AlertTriangle className="w-4 h-4 text-warm-peach" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-sky-blue" />;
      default:
        return <File className="w-4 h-4 text-charcoal" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'duplicate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="brutal-text-block text-center py-12">
        <div className="brutal-icon-box w-12 h-12 mx-auto mb-4 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-charcoal animate-spin" />
        </div>
        <p className="brutal-body">Loading files from blockchain...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brutal-alert text-center py-12">
        <div className="brutal-icon-box w-12 h-12 mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-charcoal" />
        </div>
        <p className="brutal-subheading mb-2">Error loading files</p>
        <p className="brutal-body text-sm mb-4">{error}</p>
        <Button 
          onClick={loadFiles}
          variant="outline"
          className="brutal-button-coral"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }


  // Filter files by search
  const filteredFiles = files.filter(file => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      file.name.toLowerCase().includes(q) ||
      file.hash.toLowerCase().includes(q)
    );
  });

  if (filteredFiles.length === 0) {
    return (
      <div className="brutal-text-block text-center py-12">
        <div className="brutal-icon-box w-12 h-12 mx-auto mb-4 flex items-center justify-center">
          <File className="w-6 h-6 text-charcoal" />
        </div>
        <p className="brutal-subheading mb-2">No files found</p>
        <p className="brutal-body text-sm">Try a different search or upload a file</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(maxFiles ? filteredFiles.slice(0, maxFiles) : filteredFiles).map((file) => (
        <div
          key={file.id}
          className="brutal-list-item p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(file.status)}
                <h3 className="brutal-subheading truncate text-sm sm:text-base">{file.name}</h3>
                <div className={`brutal-badge text-xs`}>
                  {file.status}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-x-6 sm:gap-y-1 text-xs sm:text-sm">
                <span className="brutal-body">Size: <span className="brutal-mono text-charcoal">{formatFileSize(file.size)}</span></span>
                <span className="brutal-body">Date: <span className="brutal-mono text-charcoal">{formatDate(file.uploadDate)}</span></span>
                <span className="brutal-body break-all sm:break-normal">Hash: <span className="brutal-mono text-charcoal truncate max-w-[120px] sm:max-w-[180px] inline-block">{file.hash}</span></span>
              </div>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto sm:ml-4 flex items-center justify-end">
              <Button
                size="sm"
                variant="outline"
                className="brutal-button-blue w-full sm:w-auto"
                onClick={() => window.open(file.ipfsUrl, '_blank')}
              >
                <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                View
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileRecords;
