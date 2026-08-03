const Store = require('../data/store');

class Analytics {
  constructor() {
    this.store = new Store();
  }

  async getReport(range) {
    const sessions = this.store.getSessions();
    // Mock aggregation logic
    return [
      { date: '2023-10-01', focusTime: '4h 20m', sessions: 12, efficiency: 85 },
      { date: '2023-10-02', focusTime: '5h 10m', sessions: 14, efficiency: 90 },
      { date: '2023-10-03', focusTime: '3h 45m', sessions: 8, efficiency: 75 },
    ];
  }

  async getTrends() {
    return [
      { name: 'Avg Daily Focus', value: '4h 15m', trend: 1 },
      { name: 'Session Count', value: 120, trend: 1 },
      { name: 'Idle Time', value: '1h 10m', trend: -1 },
    ];
  }

  async comparePeriods(d1, d2) {
    return { focusChange: '+12%', sessionChange: '+5%' };
  }

  async getDistractionHeatmap() {
    // Return mock idle counts per hour
    const map = {};
    for(let i=0; i<24; i++) map[i] = Math.floor(Math.random() * 10);
    return map;
  }
}

module.exports = Analytics;
