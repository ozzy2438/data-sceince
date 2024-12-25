import { CSVData, DataSummary } from '../types/csv';

const parseCSVLine = (line: string): string[] => {
  const cells: string[] = [];
  let currentCell = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (i + 1 < line.length && line[i + 1] === '"') {
        // Handle escaped quotes
        currentCell += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(currentCell.trim());
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  
  cells.push(currentCell.trim());
  return cells;
};

export const parseCSV = (file: File): Promise<CSVData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error('Failed to read file content');
        }

        const text = event.target.result as string;
        if (!text.trim()) {
          throw new Error('File is empty');
        }

        // Split into lines and parse each line
        const lines = text.split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(parseCSVLine);

        if (lines.length < 2) {
          throw new Error('CSV must contain headers and at least one data row');
        }
        
        const headers = lines[0];
        if (!headers.length || !headers.every(header => header.trim())) {
          throw new Error('Invalid headers: all columns must have names');
        }

        // Process data rows
        const rows = lines.slice(1).filter(row => {
          return row.length === headers.length && 
                 row.some(cell => cell.trim() !== '');
        });
        
        if (rows.length === 0) {
          throw new Error('No valid data rows found');
        }
        
        resolve({
          headers,
          rows,
          fileName: file.name
        });
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to parse CSV file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file: ' + reader.error?.message));
    reader.readAsText(file);
  });
};

export const analyzeData = (data: CSVData): DataSummary => {
  const columnTypes: Record<string, string> = {};
  const missingValues: Record<string, number> = {};
  
  data.headers.forEach((header, index) => {
    let numberCount = 0;
    let stringCount = 0;
    let missingCount = 0;
    
    data.rows.forEach(row => {
      const value = row[index];
      if (!value || value.trim() === '') {
        missingCount++;
      } else if (!isNaN(Number(value))) {
        numberCount++;
      } else {
        stringCount++;
      }
    });
    
    columnTypes[header] = numberCount > stringCount ? 'number' : 'string';
    missingValues[header] = missingCount;
  });
  
  return {
    totalRows: data.rows.length,
    totalColumns: data.headers.length,
    columnTypes,
    missingValues
  };
};