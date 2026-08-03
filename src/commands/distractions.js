const Analytics = require('../services/analytics');
const logger = require('../utils/logger');

module.exports = async () => {
  const analytics = new Analytics();
  const heatmap = await analytics.getDistractionHeatmap();
  
  console.log('Distraction Heatmap (Idle Time by Hour):');
  // Simple text visualization
  for (let i = 0; i < 24; i++) {
    const level = heatmap[i] || 0;
    const bar = '█'.repeat(Math.min(level, 10));
    console.log(`${i.toString().padStart(2, '0')}:00 ${bar}`);
  }
};
