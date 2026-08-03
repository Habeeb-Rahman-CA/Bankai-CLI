const Analytics = require('../services/analytics');
const logger = require('../utils/logger');
const Table = require('cli-table3');

module.exports = async () => {
  const analytics = new Analytics();
  const trends = await analytics.getTrends();
  
  const table = new Table({ head: ['Metric', 'Value', 'Trend'] });
  trends.forEach(t => {
    table.push([t.name, t.value, t.trend > 0 ? '↑' : '↓']);
  });
  console.log(table.toString());
};
