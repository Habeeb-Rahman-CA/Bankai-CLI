const Analytics = require('../services/analytics');
const logger = require('../utils/logger');
const Table = require('cli-table3');

module.exports = async (range = 'weekly') => {
  try {
    const analytics = new Analytics();
    const data = await analytics.getReport(range);
    
    const table = new Table({ head: ['Date', 'Focus Time', 'Sessions', 'Efficiency'] });
    data.forEach(day => {
      table.push([day.date, day.focusTime, day.sessions, `${day.efficiency}%`]);
    });
    console.log(table.toString());
  } catch (error) {
    logger.error(error.message);
  }
};
