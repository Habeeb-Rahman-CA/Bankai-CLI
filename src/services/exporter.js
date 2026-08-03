const Store = require('../data/store');

class Exporter {
  constructor() {
    this.store = new Store();
  }

  getData(options) {
    let sessions = this.store.getSessions();
    if (options.week) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      sessions = sessions.filter(s => new Date(s.startTime) > cutoff);
    }
    return sessions;
  }

  toCSV(data) {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    return `${headers}\n${rows}`;
  }
}

module.exports = Exporter;
