#!/usr/bin/env node
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
  console.log(chalk.cyan.bold(`
  ____  _       _ _       
 | __ )| | ___ | (_) ___  
 |  _ \\| |/ _ \\| | |/ _ \\ 
 | |_) | | (_) | | | (_) |
 |____/|_|\\___/|_|_|\\___/ 
  CLI v${pkg.version}
  `));
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
