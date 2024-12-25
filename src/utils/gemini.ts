import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyC1iEzdgyaNdatHyIkwr7ieeOuvzyeFaAg');

export async function getDataInsights(data: {
  headers: string[];
  preview: string[][];
  summary: {
    totalRows: number;
    missingValues: Record<string, number>;
    columnTypes: Record<string, string>;
  };
}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this CSV data and provide insights:
Headers: ${data.headers.join(', ')}
Preview Data (First 5 rows):
${data.preview.slice(0, 5).map(row => row.join(', ')).join('\n')}

Summary:
Total Rows: ${data.summary.totalRows}
Column Types:
${Object.entries(data.summary.columnTypes).map(([col, type]) => `- ${col}: ${type}`).join('\n')}

Missing Values:
${Object.entries(data.summary.missingValues).map(([col, count]) => `- ${col}: ${count}`).join('\n')}

Please provide:
1. Data Quality Assessment
2. Potential Insights
3. Recommended Analysis Steps
4. Possible Data Transformations`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().replace(/\*\*/g, '').replace(/##/g, '');
  } catch (error) {
    console.error('Error getting Gemini insights:', error);
    return null;
  }
}