const Tracker = require('../services/tracker');
const logger = require('../utils/logger');

module.exports = async (task, options) => {
  try {
    const tracker = new Tracker();
    await tracker.start(task, options);
    logger.success(`Tracking started: ${task}`);
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};
