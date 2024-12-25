import React, { useState, useCallback, useEffect } from 'react';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import DataPreview from './components/DataPreview';
import DataSummaryView from './components/DataSummary';
import AnalysisReportView from './components/AnalysisReport';
import ChatInput from './components/ChatInput';
import AIInsights from './components/AIInsights';
import { CSVData, DataSummary } from './types/csv';
import { parseCSV } from './utils/csvParser';
import { analyzeColumn, assessDataQuality } from './utils/dataAnalysis';
import { generateRecommendations } from './utils/recommendations';
import { getDataInsights } from './utils/gemini';
import { saveAnalysis, getAnalysisHistory } from './utils/supabase';
import { supabase } from './utils/supabase';

const genAI = new GoogleGenerativeAI('AIzaSyC1iEzdgyaNdatHyIkwr7ieeOuvzyeFaAg');

function App() {
  const [csvData, setCSVData] = useState<CSVData | null>(null);
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [histories, setHistories] = useState<AnalysisHistory[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [aiInsights, setAIInsights] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // For now, skip authentication since it's disabled
        await loadHistory();
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to load application data');
      }
    };
    
    initializeApp();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await getAnalysisHistory();
      setHistories(history);
    } catch (error) {
      console.error('Error loading history:', error);
      setError('Failed to load analysis history');
    }
  };

  useEffect(() => setIsLoadingInsights(false), [aiInsights]);

  const handleChatMessage = useCallback(async (message: string) => {
    try {
      setIsLoadingChat(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(message);
      const response = await result.response;
      setAIInsights(prev => `${prev}\n\nQ: ${message}\nA: ${response.text()}`);
    } catch (error) {
      console.error('Error handling chat message:', error);
    } finally {
      setIsLoadingChat(false);
    }
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setIsLoadingInsights(true);
      setError(null);
      setError(null);
      
      const data = await parseCSV(file);
      if (!data.headers.length || !data.rows.length) {
        throw new Error('Invalid CSV format: File must contain headers and data');
      }
      
      const columnAnalysis = data.headers.map((_, i) => analyzeColumn(data, i));
      const qualityMetrics = assessDataQuality(data);
      const recommendations = generateRecommendations(
        data,
        columnAnalysis,
        qualityMetrics
      );
      
      setCSVData(data);
      setAnalysisReport({
        summary: {
          totalRows: data.rows.length,
          totalColumns: data.headers.length,
          columnTypes: Object.fromEntries(
            columnAnalysis.map(col => [col.name, col.type])
          ),
          missingValues: Object.fromEntries(
            columnAnalysis.map(col => [col.name, col.missingValues])
          )
        },
        columnAnalysis,
        qualityMetrics,
        recommendations
      });
      
      // Get AI insights
      const insights = await getDataInsights({
        headers: data.headers,
        preview: data.rows.slice(0, 5),
        summary: {
          totalRows: data.rows.length,
          missingValues: Object.fromEntries(
            columnAnalysis.map(col => [col.name, col.missingValues])
          ),
          columnTypes: Object.fromEntries(
            columnAnalysis.map(col => [col.name, col.type])
          )
        }
      });
      setAIInsights(insights);
      
      // Save to Supabase
      try {
        await saveAnalysis({
          filename: file.name,
          csvData: data,
          analysisReport: analysisReport,
          insights
        });
        await loadHistory();
      } catch (error) {
        console.error('Failed to save analysis:', error);
        // Continue with analysis even if save fails
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze CSV file');
      setCSVData(null);
      setAnalysisReport(null);
      setAIInsights(null);
    }
    finally {
      setIsLoadingInsights(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      <Sidebar
        histories={histories}
        selectedId={selectedHistoryId}
        onSelect={(history) => {
          setSelectedHistoryId(history.id);
          setCSVData(history.data);
          setAnalysisReport(history.analysis_report);
          setAIInsights(history.insights);
          setShowUpload(false);
        }}
      />
      <div className="flex-1 ml-64">
        <Navbar onUploadClick={() => setShowUpload(true)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        <div className="flex items-center mb-8 mt-16">
          <FileSpreadsheet className="h-8 w-8 text-indigo-400" />
          <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            CSV Analyzer
          </h1>
        </div>

        {(!csvData || showUpload) ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <div className="space-y-8">
            {analysisReport && (
              <>
                <DataSummaryView summary={analysisReport.summary} />
                <AnalysisReportView report={analysisReport} />
                <AIInsights 
                  insights={aiInsights} 
                  isLoading={isLoadingInsights || isLoadingChat}
                  onSendMessage={handleChatMessage}
                />
              </>
            )}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Data Preview
              </h2>
              <DataPreview data={csvData} />
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default App;