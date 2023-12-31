import { data as d } from '../data.mjs';

const cleanedData = d.filter(row => row.SOC != null && row.SOC < 95)

export const normalizeData = (data, target) => {
  let featuresSum = cleanedData.reduce((acc, row) => {
    Object.keys(row).forEach(key => {
        if (key !== 'time' && key !== target) { // Assuming 'time' is not to be normalized
            acc[key] = (acc[key] || 0) + row[key];
        }
    });
    return acc;
  }, {});

  let featuresMean = {};
  let featuresStd = {};
  Object.keys(featuresSum).forEach(key => {
      featuresMean[key] = featuresSum[key] / cleanedData.length;
  });

  cleanedData.forEach(row => {
      Object.keys(row).forEach(key => {
          if (key !== 'time') {
              featuresStd[key] = (featuresStd[key] || 0) + Math.pow(row[key] - featuresMean[key], 2);
          }
      });
  });

  Object.keys(featuresStd).forEach(key => {
      featuresStd[key] = Math.sqrt(featuresStd[key] / cleanedData.length);
  });

  const normalizedData = data.map(row => {
    let normalizedRow = {};
    Object.keys(row).forEach(key => {
      if (key !== target && key !== 'time') {
        normalizedRow[key] = (row[key] - featuresMean[key]) / featuresStd[key];
      } else {
          normalizedRow[key] = row[key];
      }
    });
    return normalizedRow;
  });

  return normalizedData
}

export default normalizeData