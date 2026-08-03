const Analytics = require('../services/analytics');
const logger = require('../utils/logger');

module.exports = async (options) => {
  const analytics = new Analytics();
  const comparison = await analytics.comparePeriods(
    parseInt(options.period1), 
    parseInt(options.period2)
  );
  
  console.log('Period Comparison:');
  console.log(`Focus Time: ${comparison.focusChange}%`);
  console.log(`Sessions: ${comparison.sessionChange}%`);
};
