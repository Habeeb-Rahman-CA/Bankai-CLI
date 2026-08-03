const Store = require('../data/store');

class SyncService {
  constructor() {
    this.store = new Store();
  }
  
  getConfigPath() {
    return './config.json'; // Simplified
  }

  getStatus() {
    return { jira: 'connected', github: 'disconnected', notion: 'connected' };
  }

  async syncJira() {
    console.log('Syncing with Jira...');
    // Mock logic
    await new Promise(r => setTimeout(r, 1000));
  }

  async syncGitHub() {
    console.log('Syncing with GitHub...');
    await new Promise(r => setTimeout(r, 1000));
  }

  async syncNotion() {
    console.log('Syncing with Notion...');
    await new Promise(r => setTimeout(r, 1000));
  }
}

module.exports = SyncService;
