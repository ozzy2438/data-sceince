import { CSVData, ColumnAnalysis, DataQualityMetrics } from '../types/csv';

export const analyzeColumn = (data: CSVData, columnIndex: number): ColumnAnalysis => {
  const values = data.rows.map(row => row[columnIndex]);
  const uniqueValues = new Set(values).size;
  const missingValues = values.filter(v => !v || v.trim() === '').length;
  
  // Detect column type
  const nonEmptyValues = values.filter(v => v && v.trim() !== '');
  const numberValues = nonEmptyValues.filter(v => !isNaN(Number(v)));
  const dateValues = nonEmptyValues.filter(v => !isNaN(Date.parse(v)));
  const booleanValues = nonEmptyValues.filter(v => 
    ['true', 'false', '0', '1', 'yes', 'no'].includes(v.toLowerCase())
  );

  let type: 'number' | 'string' | 'date' | 'boolean' = 'string';
  if (numberValues.length / nonEmptyValues.length > 0.8) type = 'number';
  else if (dateValues.length / nonEmptyValues.length > 0.8) type = 'date';
  else if (booleanValues.length / nonEmptyValues.length > 0.8) type = 'boolean';

  const statistics = type === 'number' ? calculateNumericStatistics(numberValues) : undefined;

  return {
    name: data.headers[columnIndex],
    type,
    uniqueValues,
    missingValues,
    statistics
  };
};

const calculateNumericStatistics = (values: string[]) => {
  const numbers = values.map(Number);
  const sorted = [...numbers].sort((a, b) => a - b);
  
  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    mean: numbers.reduce((a, b) => a + b, 0) / numbers.length,
    median: sorted[Math.floor(sorted.length / 2)],
    standardDeviation: calculateStandardDeviation(numbers)
  };
};

const calculateStandardDeviation = (numbers: number[]) => {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squareDiffs = numbers.map(value => Math.pow(value - mean, 2));
  const variance = squareDiffs.reduce((a, b) => a + b, 0) / numbers.length;
  return Math.sqrt(variance);
};

export const assessDataQuality = (data: CSVData): DataQualityMetrics => {
  const totalCells = data.rows.length * data.headers.length;
  const nonEmptyCells = data.rows.reduce((acc, row) => 
    acc + row.filter(cell => cell && cell.trim() !== '').length, 0
  );

  const duplicateRows = findDuplicateRows(data.rows);
  const outliers = detectOutliers(data);

  return {
    completeness: nonEmptyCells / totalCells,
    consistency: calculateConsistencyScore(data),
    duplicateRows: duplicateRows.length,
    outliers
  };
};

const findDuplicateRows = (rows: string[][]): string[][] => {
  const seen = new Set<string>();
  return rows.filter(row => {
    const key = row.join('|');
    if (seen.has(key)) return true;
    seen.add(key);
    return false;
  });
};

const detectOutliers = (data: CSVData): Record<string, number[]> => {
  const outliers: Record<string, number[]> = {};
  
  data.headers.forEach((header, index) => {
    const values = data.rows.map(row => Number(row[index]))
      .filter(val => !isNaN(val));
    
    if (values.length > 0) {
      const q1 = calculateQuantile(values, 0.25);
      const q3 = calculateQuantile(values, 0.75);
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      
      outliers[header] = values.filter(v => v < lowerBound || v > upperBound);
    }
  });
  
  return outliers;
};

const calculateQuantile = (values: number[], q: number): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};

const calculateConsistencyScore = (data: CSVData): number => {
  let consistentColumns = 0;
  
  data.headers.forEach((_, index) => {
    const values = data.rows.map(row => row[index]);
    const types = values.map(getValueType);
    const dominantType = getMostCommonType(types);
    const typeConsistency = types.filter(t => t === dominantType).length / types.length;
    
    if (typeConsistency > 0.9) consistentColumns++;
  });
  
  return consistentColumns / data.headers.length;
};

const getValueType = (value: string): string => {
  if (!value || value.trim() === '') return 'empty';
  if (!isNaN(Number(value))) return 'number';
  if (!isNaN(Date.parse(value))) return 'date';
  return 'string';
};

const getMostCommonType = (types: string[]): string => {
  const counts = types.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)[0][0];
};