export interface AnalysisHistory {
  id: string;
  filename: string;
  created_at: string;
  summary: {
    totalRows: number;
    totalColumns: number;
  };
  analysis_report: any; // Full analysis report
  insights: string;
}

export interface SidebarProps {
  histories: AnalysisHistory[];
  selectedId: string | null;
  onSelect: (history: AnalysisHistory) => void;
}