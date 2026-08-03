const Tracker = require('../services/tracker');
const logger = require('../utils/logger');
const Table = require('cli-table3');

module.exports = async () => {
  try {
    const tracker = new Tracker();
    const status = await tracker.getStatus();
    
    if (!status.active) {
      console.log('No active session.');
      return;
    }

    const table = new Table({ head: ['Task', 'Project', 'Started', 'Duration'] });
    table.push([status.task, status.project || '-', status.startTime, status.elapsed]);
    console.log(table.toString());
  } catch (error) {
    logger.error(error.message);
  }
};
