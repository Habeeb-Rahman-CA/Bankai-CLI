const Store = require('../data/store');
const IdleMonitor = require('./idle-monitor');
const NotificationService = require('./notification-service');
const WebhookService = require('./webhook-service');

class Tracker {
  constructor() {
    this.store = new Store();
    this.idleMonitor = new IdleMonitor();
    this.notifications = new NotificationService();
    this.webhooks = new WebhookService();
  }

  async start(task, options) {
    const session = {
      id: Date.now().toString(),
      task,
      project: options.project,
      startTime: new Date().toISOString(),
      tags: []
    };
    this.store.setActiveSession(session);
    this.idleMonitor.startMonitoring();
    return session;
  }

  async stop() {
    const active = this.store.getActiveSession();
    if (!active) return null;
    
    const endTime = new Date();
    const duration = Math.round((endTime - new Date(active.startTime)) / 60000); // mins
    
    const completed = { ...active, endTime: endTime.toISOString(), duration };
    this.store.saveSession(completed);
    this.store.clearActiveSession();
    this.idleMonitor.stopMonitoring();
    
    // Trigger events
    this.webhooks.trigger('session.end', completed);
    if (this.notifications.isEnabled()) {
      this.notifications.send('Session Complete', `You focused for ${duration} minutes`);
    }
    
    return completed;
  }

  async getStatus() {
    const active = this.store.getActiveSession();
    if (!active) return { active: false };
    
    const start = new Date(active.startTime);
    const now = new Date();
    const elapsed = Math.round((now - start) / 60000);
    
    return {
      active: true,
      ...active,
      elapsed: `${elapsed} mins`
    };
  }

  async logSession(data) {
    this.store.saveSession({
      id: Date.now().toString(),
      ...data,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    });
  }
}

module.exports = Tracker;
