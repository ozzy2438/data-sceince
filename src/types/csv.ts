export interface CSVData {
  headers: string[];
  rows: string[][];
  fileName: string;
}

export interface DataSummary {
  totalRows: number;
  totalColumns: number;
  columnTypes: Record<string, string>;
  missingValues: Record<string, number>;
}

export interface TransformationOptions {
  filterColumn?: string;
  filterValue?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  groupByColumn?: string;
  aggregateFunction?: 'sum' | 'average' | 'count' | 'min' | 'max';
  aggregateColumn?: string;
}

export interface ColumnAnalysis {
  name: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  uniqueValues: number;
  missingValues: number;
  statistics?: {
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    mode?: string | number;
    standardDeviation?: number;
  };
}

export interface DataQualityMetrics {
  completeness: number;
  consistency: number;
  duplicateRows: number;
  outliers: Record<string, number[]>;
}

export interface AnalysisReport {
  summary: DataSummary;
  columnAnalysis: ColumnAnalysis[];
  qualityMetrics: DataQualityMetrics;
  recommendations: string[];
}