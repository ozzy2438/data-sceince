import React from 'react';
import { CSVData } from '../types/csv';

interface DataPreviewProps {
  data: CSVData;
}

export default function DataPreview({ data }: DataPreviewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {data.headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.rows.slice(0, 10).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.rows.length > 10 && (
        <p className="text-sm text-gray-400 mt-4 text-center">
          Showing first 10 rows of {data.rows.length} total rows
        </p>
      )}
    </div>
  );
}