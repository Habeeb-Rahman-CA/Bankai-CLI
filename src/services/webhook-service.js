const Store = require('../data/store');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

class WebhookService {
  constructor() {
    this.store = new Store();
  }

  add(url, events) {
    const config = this.store.getConfig();
    if (!config.webhooks) config.webhooks = [];
    config.webhooks.push({ url, events, active: true });
    this.store.saveConfig(config);
  }

  list() {
    return this.store.getConfig().webhooks || [];
  }

  remove(index) {
    const config = this.store.getConfig();
    if (!config.webhooks) return;
    config.webhooks.splice(index, 1);
    this.store.saveConfig(config);
  }

  async trigger(event, payload) {
    const hooks = this.list().filter(h => h.events.includes(event) && h.active);
    for (const hook of hooks) {
      try {
        await this.sendRequest(hook.url, payload);
      } catch (e) {
        console.error(`Webhook failed: ${hook.url}`);
      }
    }
  }

  async test(index) {
    const hook = this.list()[index];
    if (!hook) throw new Error('Invalid index');
    await this.sendRequest(hook.url, { test: true, timestamp: new Date() });
  }

  sendRequest(url, data) {
    return new Promise((resolve, reject) => {
      const lib = url.startsWith('https') ? https : http;
      const req = lib.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, res => {
        if (res.statusCode === 200) resolve();
        else reject(new Error(`Status ${res.statusCode}`));
      });
      req.write(JSON.stringify(data));
      req.end();
    });
  }
}

module.exports = WebhookService;
