import React, { useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError(null);
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.name.toLowerCase().endsWith('.csv') || 
      file.type === 'text/csv'
    );
    
    if (csvFile) {
      onFileSelect(csvFile);
    } else {
      setError('Please upload a valid CSV file');
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file?.name.toLowerCase().endsWith('.csv') || file?.type === 'text/csv') {
      onFileSelect(file);
    } else if (file) {
      setError('Please upload a valid CSV file');
    }
  }, [onFileSelect]);

  return (
    <>
      <div
        className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center 
                   hover:border-indigo-400 transition-colors cursor-pointer
                   bg-gray-800/50 backdrop-blur-sm"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept=".csv"
          onChange={handleFileInput}
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
        <p className="text-lg font-medium text-gray-300">
          Drag and drop your CSV file here
        </p>
        <p className="text-sm text-gray-400 mt-2">
          or click to browse your files
        </p>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </>
  );
}