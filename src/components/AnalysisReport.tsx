import React from 'react';
import { AnalysisReport } from '../types/csv';
import { BarChart2, AlertTriangle, CheckCircle, FileWarning } from 'lucide-react';

interface AnalysisReportProps {
  report: AnalysisReport;
}

export default function AnalysisReportView({ report }: AnalysisReportProps) {
  const qualityScore = Math.round(
    (report.qualityMetrics.completeness + report.qualityMetrics.consistency) * 50
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart2 className="w-6 h-6 mr-2 text-indigo-600" />
          Data Quality Score: {qualityScore}/100
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-medium">Completeness</h3>
            </div>
            <p className="text-2xl font-bold">
              {Math.round(report.qualityMetrics.completeness * 100)}%
            </p>
          </div>
          
          <div className="bg-gray-50 rounded p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="font-medium">Duplicate Rows</h3>
            </div>
            <p className="text-2xl font-bold">{report.qualityMetrics.duplicateRows}</p>
          </div>
          
          <div className="bg-gray-50 rounded p-4">
            <div className="flex items-center mb-2">
              <FileWarning className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-medium">Outliers</h3>
            </div>
            <p className="text-2xl font-bold">
              {Object.values(report.qualityMetrics.outliers)
                .reduce((acc, curr) => acc + curr.length, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Column Analysis</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Column
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unique Values
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Missing Values
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistics
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.columnAnalysis.map((column, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {column.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.uniqueValues}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.missingValues}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {column.statistics && (
                      <div className="space-y-1">
                        <p>Min: {column.statistics.min?.toFixed(2)}</p>
                        <p>Max: {column.statistics.max?.toFixed(2)}</p>
                        <p>Mean: {column.statistics.mean?.toFixed(2)}</p>
                        <p>Std Dev: {column.statistics.standardDeviation?.toFixed(2)}</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {report.recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
          <ul className="space-y-2">
            {report.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 text-sm">{index + 1}</span>
                </span>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}