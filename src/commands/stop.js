const Tracker = require('../services/tracker');
const logger = require('../utils/logger');

module.exports = async () => {
  try {
    const tracker = new Tracker();
    const session = await tracker.stop();
    if (session) {
      logger.success(`Session stopped. Duration: ${session.duration}`);
    } else {
      logger.warn('No active session found.');
    }
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};
