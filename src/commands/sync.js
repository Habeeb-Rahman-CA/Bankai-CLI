const SyncService = require('../services/sync-service');
const logger = require('../utils/logger');

module.exports = async (options) => {
  const service = new SyncService();
  
  if (options.status) {
    const status = service.getStatus();
    console.log(JSON.stringify(status, null, 2));
    return;
  }
  
  if (options.config) {
    console.log('Config file location:', service.getConfigPath());
    console.log('Add your API keys there.');
    return;
  }

  if (options.jira) await service.syncJira();
  if (options.github) await service.syncGitHub();
  if (options.notion) await service.syncNotion();
  
  logger.success('Sync completed');
};
