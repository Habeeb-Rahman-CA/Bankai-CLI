const fs = require('fs');
const path = require('path');

class Store {
  constructor() {
    this.dbPath = path.join(process.cwd(), 'bankai-data.json');
    if (!fs.existsSync(this.dbPath)) {
      this.initDB();
    }
  }

  initDB() {
    const initial = { sessions: [], sprints: [], config: {}, activeSession: null };
    fs.writeFileSync(this.dbPath, JSON.stringify(initial, null, 2));
  }

  read() {
    return JSON.parse(fs.readFileSync(this.dbPath));
  }

  write(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }

  setActiveSession(session) {
    const data = this.read();
    data.activeSession = session;
    this.write(data);
  }

  getActiveSession() {
    return this.read().activeSession;
  }

  clearActiveSession() {
    const data = this.read();
    data.activeSession = null;
    this.write(data);
  }

  saveSession(session) {
    const data = this.read();
    data.sessions.push(session);
    this.write(data);
  }

  getSessions() {
    return this.read().sessions;
  }

  addSprint(sprint) {
    const data = this.read();
    if (!data.sprints) data.sprints = [];
    data.sprints.push(sprint);
    this.write(data);
  }

  getSprints() {
    return this.read().sprints || [];
  }

  completeSprint(id) {
    const data = this.read();
    const sprint = data.sprints.find(s => s.id === id);
    if (sprint) {
      sprint.completed = true;
      this.write(data);
    }
  }

  addTagsToActiveSession(tags) {
    const data = this.read();
    if (!data.activeSession) throw new Error('No active session');
    data.activeSession.tags = [...(data.activeSession.tags || []), ...tags];
    this.write(data);
  }

  getConfig() {
    const data = this.read();
    return data.config || {};
  }

  saveConfig(config) {
    const data = this.read();
    data.config = config;
    this.write(data);
  }
}

module.exports = Store;
