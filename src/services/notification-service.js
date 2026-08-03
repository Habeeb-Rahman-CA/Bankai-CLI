const notifier = require('node-notifier');
const Store = require('../data/store');

class NotificationService {
  constructor() {
    this.store = new Store();
  }
  
  isEnabled() {
    const config = this.store.getConfig();
    return config.notifications?.enabled || false;
  }
  
  enable() {
    const config = this.store.getConfig();
    config.notifications = { ...config.notifications, enabled: true };
    this.store.saveConfig(config);
  }
  
  disable() {
    const config = this.store.getConfig();
    config.notifications = { ...config.notifications, enabled: false };
    this.store.saveConfig(config);
  }

  setIdleThreshold(mins) {
    const config = this.store.getConfig();
    config.notifications = { ...config.notifications, idleThreshold: mins };
    this.store.saveConfig(config);
  }
  
  send(title, message) {
    if (!this.isEnabled()) return;
    notifier.notify({ title, message });
  }
}

module.exports = NotificationService;
