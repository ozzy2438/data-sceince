import { CSVData, ColumnAnalysis, DataQualityMetrics } from '../types/csv';

export const generateRecommendations = (
  data: CSVData,
  columnAnalysis: ColumnAnalysis[],
  qualityMetrics: DataQualityMetrics
): string[] => {
  const recommendations: string[] = [];

  // Data completeness recommendations
  if (qualityMetrics.completeness < 0.9) {
    recommendations.push(
      'Consider handling missing values through imputation or removal to improve data completeness.'
    );
  }

  // Duplicate recommendations
  if (qualityMetrics.duplicateRows > 0) {
    recommendations.push(
      `Found ${qualityMetrics.duplicateRows} duplicate rows. Consider removing duplicates for more accurate analysis.`
    );
  }

  // Column-specific recommendations
  columnAnalysis.forEach(column => {
    if (column.missingValues > 0) {
      const missingPercentage = (column.missingValues / data.rows.length) * 100;
      if (missingPercentage > 20) {
        recommendations.push(
          `Column "${column.name}" has ${missingPercentage.toFixed(1)}% missing values. Consider if this column is necessary or if missing data can be collected.`
        );
      }
    }

    if (column.type === 'number' && column.statistics) {
      const outlierCount = qualityMetrics.outliers[column.name]?.length || 0;
      if (outlierCount > 0) {
        recommendations.push(
          `Found ${outlierCount} potential outliers in "${column.name}". Review these values for accuracy.`
        );
      }
    }
  });

  // Data type consistency recommendations
  if (qualityMetrics.consistency < 0.9) {
    recommendations.push(
      'Some columns have inconsistent data types. Consider standardizing data formats for better analysis.'
    );
  }

  // Unique value recommendations
  columnAnalysis.forEach(column => {
    if (column.uniqueValues === data.rows.length && data.rows.length > 0) {
      recommendations.push(
        `Column "${column.name}" has all unique values. This might be an ID column or contain unique identifiers.`
      );
    }
  });

  return recommendations;
};