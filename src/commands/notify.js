const NotificationService = require('../services/notification-service');
const logger = require('../utils/logger');

module.exports = async (options) => {
  const service = new NotificationService();
  
  if (options.enable) {
    service.enable();
    logger.success('Notifications enabled');
  } else if (options.disable) {
    service.disable();
    logger.success('Notifications disabled');
  } else if (options.test) {
    service.send('Test', 'Bankai CLI is working!');
  } else if (options.idle) {
    service.setIdleThreshold(parseInt(options.idle));
    logger.success(`Idle threshold set to ${options.idle} mins`);
  }
};
