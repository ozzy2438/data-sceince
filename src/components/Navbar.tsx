import React from 'react';
import { Upload, History } from 'lucide-react';

interface NavbarProps {
  onUploadClick: () => void;
}

export default function Navbar({ onUploadClick }: NavbarProps) {
  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onUploadClick}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 
                     text-white rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New File</span>
          </button>
        </div>
      </div>
    </div>
  );
}