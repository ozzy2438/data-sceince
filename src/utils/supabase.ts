import { createClient } from '@supabase/supabase-js';
import type { CSVData, AnalysisReport } from '../types/csv';

// Generate a random session ID for the current browser session
const SESSION_ID = crypto.randomUUID();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveAnalysis(data: {
  filename: string;
  csvData: CSVData;
  analysisReport: AnalysisReport;
  insights: string;
}) {
  try {
    const { error } = await supabase
      .from('analysis_history')
      .insert({
        session_id: SESSION_ID,
        filename: data.filename,
        data: data.csvData,
        summary: {
          totalRows: data.csvData.rows.length,
          totalColumns: data.csvData.headers.length
        },
        analysis_report: data.analysisReport,
        insights: data.insights
      });

    if (error) {
      console.error('Supabase save error:', error);
      throw new Error('Failed to save analysis');
    }
  } catch (error) {
    console.error('Save analysis error:', error);
    throw new Error('Failed to save analysis');
  }
}

export async function getAnalysisHistory() {
  try {
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('session_id', SESSION_ID)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase fetch error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Get history error:', error);
    return [];
  }
}