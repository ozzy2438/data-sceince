import React from 'react';
import { DataSummary } from '../types/csv';
import { FileText, Database, AlertCircle } from 'lucide-react';

interface DataSummaryProps {
  summary: DataSummary;
}

export default function DataSummaryView({ summary }: DataSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-indigo-400" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Total Columns</p>
            <p className="text-2xl font-semibold text-gray-100">
              {summary.totalColumns}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center">
          <Database className="h-8 w-8 text-indigo-400" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Total Rows</p>
            <p className="text-2xl font-semibold text-gray-100">
              {summary.totalRows}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center">
          <AlertCircle className="h-8 w-8 text-yellow-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Missing Values</p>
            <p className="text-2xl font-semibold text-gray-100">
              {Object.values(summary.missingValues).reduce((a, b) => a + b, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}