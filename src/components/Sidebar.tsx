import React from 'react';
import { History, FileSpreadsheet } from 'lucide-react';
import { AnalysisHistory } from '../types/history';

interface SidebarProps {
  histories: AnalysisHistory[];
  selectedId: string | null;
  onSelect: (history: AnalysisHistory) => void;
}

export default function Sidebar({ histories, selectedId, onSelect }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-gray-900 border-r border-gray-700 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <History className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Analysis History</h2>
        </div>
        
        <div className="space-y-2">
          {histories.map((history) => (
            <button
              key={history.id}
              onClick={() => onSelect(history)}
              className={`w-full text-left p-3 rounded-lg transition-colors
                ${selectedId === history.id 
                  ? 'bg-indigo-500/20 border-indigo-500' 
                  : 'hover:bg-gray-800 border-transparent'
                } border flex items-start space-x-3`}
            >
              <FileSpreadsheet className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {history.filename}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(history.created_at).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                    {history.summary.totalRows} rows
                  </span>
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                    {history.summary.totalColumns} columns
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}