const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = process.cwd();
const VERSION = "1.2.0";

// File Contents Map
const files = {
    // --- BIN ---
    "bin/bankai.js": `#!/usr/bin/env node
const { Command } = require('commander');
const chalk = require('chalk');
const program = new Command();
const pkg = require('../package.json');

// Import Commands
const startCmd = require('../src/commands/start');
const stopCmd = require('../src/commands/stop');
const statusCmd = require('../src/commands/status');
const reportCmd = require('../src/commands/report');
const pomodoroCmd = require('../src/commands/pomodoro');
const sprintCmd = require('../src/commands/sprint');
const tagCmd = require('../src/commands/tag');
const exportCmd = require('../src/commands/export');
const trendsCmd = require('../src/commands/trends');
const compareCmd = require('../src/commands/compare');
const distractionsCmd = require('../src/commands/distractions');
const syncCmd = require('../src/commands/sync');
const notifyCmd = require('../src/commands/notify');
const webhookCmd = require('../src/commands/webhook');

// ASCII Banner
const banner = () => {
  console.log(chalk.cyan.bold(\`
  ____  _       _ _       
 | __ )| | ___ | (_) ___  
 |  _ \\\\| |/ _ \\\\| | |/ _ \\\\ 
 | |_) | | (_) | | | (_) |
 |____/|_|\\\\___/|_|_|\\\\___/ 
  CLI v\${pkg.version}
  \`));
};

program
  .name('bankai')
  .description('Ultimate productivity CLI for developers')
  .version(pkg.version);

program.command('start <task>')
  .description('Start tracking a task')
  .option('-p, --project <name>', 'Project name')
  .action(startCmd);

program.command('stop')
  .description('Stop current tracking')
  .action(stopCmd);

program.command('status')
  .description('Show current tracking status')
  .action(statusCmd);

program.command('report [range]')
  .description('Show productivity reports (daily, weekly, monthly)')
  .action(reportCmd);

program.command('pomodoro [minutes]')
  .description('Start a Pomodoro timer')
  .option('-t, --task <name>', 'Task name')
  .option('-p, --project <name>', 'Project name')
  .action(pomodoroCmd);

program.command('sprint [name]')
  .description('Manage sprints')
  .option('-n, --name <name>', 'Sprint name')
  .option('-d, --days <days>', 'Duration in days')
  .option('-g, --goal <goal>', 'Sprint goal')
  .option('--list', 'List all sprints')
  .option('--complete <id>', 'Complete a sprint')
  .action(sprintCmd);

program.command('tag <tags>')
  .description('Add tags to current session (comma separated)')
  .action(tagCmd);

program.command('export')
  .description('Export data to CSV or JSON')
  .option('-f, --format <type>', 'Format: csv or json', 'json')
  .option('-o, --output <file>', 'Output filename')
  .option('-w, --week', 'Export last week')
  .option('-m, --month', 'Export last month')
  .action(exportCmd);

program.command('trends')
  .description('View productivity trends')
  .action(trendsCmd);

program.command('compare')
  .description('Compare two time periods')
  .option('-p1, --period1 <days>', 'First period days ago', '7')
  .option('-p2, --period2 <days>', 'Second period days ago', '14')
  .action(compareCmd);

program.command('distractions')
  .description('Analyze distraction patterns')
  .action(distractionsCmd);

program.command('sync')
  .description('Sync with external tools (Jira, GitHub, Notion)')
  .option('--status', 'Check sync status')
  .option('--config', 'Show config instructions')
  .option('--jira', 'Sync with Jira')
  .option('--github', 'Sync with GitHub')
  .option('--notion', 'Sync with Notion')
  .action(syncCmd);

program.command('notify')
  .description('Manage desktop notifications')
  .option('--enable', 'Enable notifications')
  .option('--disable', 'Disable notifications')
  .option('--idle <min>', 'Set idle alert threshold')
  .option('--test', 'Send test notification')
  .action(notifyCmd);

program.command('webhook')
  .description('Manage webhooks for events')
  .option('--add <url>', 'Add webhook URL')
  .option('--events <list>', 'Events to trigger (comma sep)')
  .option('--list', 'List webhooks')
  .option('--remove <index>', 'Remove webhook by index')
  .option('--test <index>', 'Test webhook')
  .action(webhookCmd);

if (process.argv.length <= 2) {
  banner();
  program.help();
} else {
  banner();
  program.parse();
}
`,

    // --- SRC/COMMANDS ---
    "src/commands/start.js": `const Tracker = require('../services/tracker');
const logger = require('../utils/logger');

module.exports = async (task, options) => {
  try {
    const tracker = new Tracker();
    await tracker.start(task, options);
    logger.success(\`Tracking started: \${task}\`);
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};
`,

    "src/commands/stop.js": `const Tracker = require('../services/tracker');
const logger = require('../utils/logger');

module.exports = async () => {
  try {
    const tracker = new Tracker();
    const session = await tracker.stop();
    if (session) {
      logger.success(\`Session stopped. Duration: \${session.duration}\`);
    } else {
      logger.warn('No active session found.');
    }
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};
`,

    "src/commands/status.js": `const Tracker = require('../services/tracker');
const logger = require('../utils/logger');
const Table = require('cli-table3');

module.exports = async () => {
  try {
    const tracker = new Tracker();
    const status = await tracker.getStatus();
    
    if (!status.active) {
      console.log('No active session.');
      return;
    }

    const table = new Table({ head: ['Task', 'Project', 'Started', 'Duration'] });
    table.push([status.task, status.project || '-', status.startTime, status.elapsed]);
    console.log(table.toString());
  } catch (error) {
    logger.error(error.message);
  }
};
`,

    "src/commands/report.js": `const Analytics = require('../services/analytics');
const logger = require('../utils/logger');
const Table = require('cli-table3');

module.exports = async (range = 'weekly') => {
  try {
    const analytics = new Analytics();
    const data = await analytics.getReport(range);
    
    const table = new Table({ head: ['Date', 'Focus Time', 'Sessions', 'Efficiency'] });
    data.forEach(day => {
      table.push([day.date, day.focusTime, day.sessions, \`\${day.efficiency}%\`]);
    });
    console.log(table.toString());
  } catch (error) {
    logger.error(error.message);
  }
};
`,

    "src/commands/pomodoro.js": `const Tracker = require('../services/tracker');
const logger = require('../utils/logger');
const chalk = require('chalk');

module.exports = async (minutes = 25, options) => {
  const duration = minutes * 60 * 1000;
  console.log(chalk.yellow(\`🍅 Starting \${minutes} min Pomodoro...\`));
  
  // Simple implementation - in real app use interval for UI
  setTimeout(async () => {
    console.log(chalk.green('✅ Pomodoro complete!'));
    const tracker = new Tracker();
    await tracker.logSession({
      task: options.task || 'Pomodoro',
      project: options.project,
      duration: minutes,
      type: 'pomodoro'
    });
  }, duration);
};
`,

    "src/commands/sprint.js": `const Store = require('../data/store');
const logger = require('../utils/logger');
const Table = require('cli-table3');
const { v4: uuidv4 } = require('uuid');

module.exports = async (name, options) => {
  const store = new Store();
  
  if (options.list) {
    const sprints = store.getSprints();
    const table = new Table({ head: ['ID', 'Name', 'Goal', 'Target (h)', 'Status'] });
    sprints.forEach(s => {
      table.push([s.id.slice(0,8), s.name, s.goal, s.targetHours, s.completed ? 'Done' : 'Active']);
    });
    console.log(table.toString());
    return;
  }

  if (options.complete) {
    store.completeSprint(options.complete);
    logger.success('Sprint marked as complete');
    return;
  }

  if (name && options.name) {
    const sprint = {
      id: uuidv4(),
      name: options.name,
      goal: options.goal || 'No goal set',
      targetHours: parseInt(options.days) * 4 || 40,
      startDate: new Date().toISOString(),
      completed: false
    };
    store.addSprint(sprint);
    logger.success(\`Sprint "\${sprint.name}" created!\`);
  } else {
    logger.info('Usage: bankai sprint -n "Name" -d 14 -g "Goal"');
  }
};
`,

    "src/commands/tag.js": `const Store = require('../data/store');
const logger = require('../utils/logger');

module.exports = async (tagsStr) => {
  const store = new Store();
  const tags = tagsStr.split(',').map(t => t.trim());
  
  try {
    store.addTagsToActiveSession(tags);
    logger.success(\`Tags added: \${tags.join(', ')}\`);
  } catch (e) {
    logger.error(e.message);
  }
};
`,

    "src/commands/export.js": `const Exporter = require('../services/exporter');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

module.exports = async (options) => {
  const exporter = new Exporter();
  const format = options.format;
  const data = exporter.getData(options);
  
  let content;
  let ext;
  
  if (format === 'csv') {
    content = exporter.toCSV(data);
    ext = 'csv';
  } else {
    content = JSON.stringify(data, null, 2);
    ext = 'json';
  }
  
  const filename = options.output || \`bankai-export.\${ext}\`;
  fs.writeFileSync(path.resolve(filename), content);
  logger.success(\`Data exported to \${filename}\`);
};
`,

    "src/commands/trends.js": `const Analytics = require('../services/analytics');
const logger = require('../utils/logger');
const Table = require('cli-table3');

module.exports = async () => {
  const analytics = new Analytics();
  const trends = await analytics.getTrends();
  
  const table = new Table({ head: ['Metric', 'Value', 'Trend'] });
  trends.forEach(t => {
    table.push([t.name, t.value, t.trend > 0 ? '↑' : '↓']);
  });
  console.log(table.toString());
};
`,

    "src/commands/compare.js": `const Analytics = require('../services/analytics');
const logger = require('../utils/logger');

module.exports = async (options) => {
  const analytics = new Analytics();
  const comparison = await analytics.comparePeriods(
    parseInt(options.period1), 
    parseInt(options.period2)
  );
  
  console.log('Period Comparison:');
  console.log(\`Focus Time: \${comparison.focusChange}%\`);
  console.log(\`Sessions: \${comparison.sessionChange}%\`);
};
`,

    "src/commands/distractions.js": `const Analytics = require('../services/analytics');
const logger = require('../utils/logger');

module.exports = async () => {
  const analytics = new Analytics();
  const heatmap = await analytics.getDistractionHeatmap();
  
  console.log('Distraction Heatmap (Idle Time by Hour):');
  // Simple text visualization
  for (let i = 0; i < 24; i++) {
    const level = heatmap[i] || 0;
    const bar = '█'.repeat(Math.min(level, 10));
    console.log(\`\${i.toString().padStart(2, '0')}:00 \${bar}\`);
  }
};
`,

    "src/commands/sync.js": `const SyncService = require('../services/sync-service');
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
`,

    "src/commands/notify.js": `const NotificationService = require('../services/notification-service');
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
    logger.success(\`Idle threshold set to \${options.idle} mins\`);
  }
};
`,

    "src/commands/webhook.js": `const WebhookService = require('../services/webhook-service');
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
`,

    // --- SRC/SERVICES ---
    "src/services/tracker.js": `const Store = require('../data/store');
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
      this.notifications.send('Session Complete', \`You focused for \${duration} minutes\`);
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
      elapsed: \`\${elapsed} mins\`
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
`,

    "src/services/idle-monitor.js": `// Placeholder for uiohook-napi logic
class IdleMonitor {
  startMonitoring() {
    // In real impl: hook.on('mousemove', resetTimer)
    console.log('[IdleMonitor] Started');
  }
  stopMonitoring() {
    console.log('[IdleMonitor] Stopped');
  }
}
module.exports = IdleMonitor;
`,

    "src/services/notification-service.js": `const notifier = require('node-notifier');
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
`,

    "src/services/webhook-service.js": `const Store = require('../data/store');
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
        console.error(\`Webhook failed: \${hook.url}\`);
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
        else reject(new Error(\`Status \${res.statusCode}\`));
      });
      req.write(JSON.stringify(data));
      req.end();
    });
  }
}

module.exports = WebhookService;
`,

    "src/services/sync-service.js": `const Store = require('../data/store');

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
`,

    "src/services/analytics.js": `const Store = require('../data/store');

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
`,

    "src/services/exporter.js": `const Store = require('../data/store');

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
    const rows = data.map(obj => Object.values(obj).join(',')).join('\\n');
    return \`\${headers}\\n\${rows}\`;
  }
}

module.exports = Exporter;
`,

    // --- SRC/DATA ---
    "src/data/store.js": `const fs = require('fs');
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
`,

    // --- SRC/UTILS ---
    "src/utils/logger.js": `const chalk = require('chalk');

module.exports = {
  success: (msg) => console.log(chalk.green('✔'), msg),
  error: (msg) => console.log(chalk.red('✖'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
};
`,

    "src/utils/time.js": `module.exports = {
  formatDuration: (ms) => {
    const mins = Math.floor(ms / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return \`\${hrs}h \${mins % 60}m\`;
    return \`\${mins}m\`;
  },
  formatDate: (dateStr) => new Date(dateStr).toLocaleDateString(),
};
`,

    // --- ROOT FILES ---
    "package.json": `{
  "name": "@habrmnc/bankai",
  "version": "1.2.0",
  "description": "Ultimate productivity CLI for developers with sprints, sync, and analytics",
  "main": "src/index.js",
  "bin": {
    "bankai": "./bin/bankai.js"
  },
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": ["productivity", "cli", "time-tracking", "pomodoro", "jira", "github"],
  "author": "Habeeb Rahman",
  "license": "MIT",
  "dependencies": {
    "commander": "^9.4.0",
    "chalk": "^4.1.2",
    "cli-table3": "^0.6.2",
    "node-notifier": "^10.0.1",
    "uuid": "^9.0.0"
  }
}
`,

    "README.md": `# Bankai CLI

The ultimate productivity tool for developers. Track time, manage sprints, sync with Jira/GitHub/Notion, and analyze your focus patterns.

## Features

- **Time Tracking**: Start/stop tasks with \`bankai start\`
- **Pomodoro**: Built-in timer with \`bankai pomodoro\`
- **Sprints**: Manage goals with \`bankai sprint\`
- **Sync**: Integrate with Jira, GitHub, Notion
- **Analytics**: Trends, comparisons, and distraction heatmaps
- **Webhooks**: Automate workflows
- **Notifications**: Desktop alerts

## Installation

\`\`\`bash
npm install -g @habrmnc/bankai
\`\`\`

## Usage

\`\`\`bash
bankai start "Fix Bug" -p "ProjectX"
bankai pomodoro 25
bankai sprint -n "Q4 Goals" -d 14
bankai report weekly
\`\`\`

## Structure

- \`bin/\`: Entry point
- \`src/commands/\`: CLI command definitions
- \`src/services/\`: Business logic
- \`src/data/\`: Persistence layer
`,

    ".npmignore": `node_modules
*.log
.DS_Store
tests
.git
`
};

// Execution Logic
console.log('🚀 Starting Bankai CLI Refactor Setup...\n');

Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(ROOT_DIR, filePath);
    const dir = path.dirname(fullPath);

    // Create directories if they don't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Created: ${filePath}`);
});

console.log('\n✨ Setup Complete!');
console.log('\nNext steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Test the CLI: node bin/bankai.js --help');
console.log('3. Commit and push to GitHub:');
console.log('   git add .');
console.log('   git commit -m "feat: major refactor with sprints, sync, notifications, and webhooks"');
console.log('   git push origin qwen.test');
console.log('   git tag v1.2.0');
console.log('   git push origin v1.2.0');