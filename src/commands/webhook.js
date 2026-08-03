const WebhookService = require('../services/webhook-service');
const logger = require('../utils/logger');
const Table = require('cli-table3');

module.exports = async (options) => {
  const service = new WebhookService();
  
  if (options.add) {
    service.add(options.add, options.events ? options.events.split(',') : ['session.end']);
    logger.success('Webhook added');
  } else if (options.list) {
    const hooks = service.list();
    const table = new Table({ head: ['Index', 'URL', 'Events'] });
    hooks.forEach((h, i) => table.push([i, h.url, h.events.join(', ')]));
    console.log(table.toString());
  } else if (options.remove) {
    service.remove(parseInt(options.remove));
    logger.success('Webhook removed');
  } else if (options.test) {
    await service.test(parseInt(options.test));
    logger.success('Webhook tested');
  }
};
