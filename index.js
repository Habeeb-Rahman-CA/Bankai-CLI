#!/usr/bin/env node
const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const pkg = require('./package.json');
const program = new Command();

// Update Notifier
import('update-notifier').then(({ default: updateNotifier }) => {
    updateNotifier({ pkg }).notify();
});

program
    .name(chalk.magenta.bold('bankai'))
    .description(chalk.cyan('Enter your flow state and track your deep work!'))
    .version('1.1.0', '-v, --version');

// Branded Help Screen with Figlet and Gradient
const logo = figlet.textSync('BANKAI', { font: 'Slant' });
const bankaiGradient = (gradient.default || gradient)(['#ff00ff', '#ff0000', '#220022']); // Magenta to Red to Darker

program.addHelpText('before', `
${bankaiGradient.multiline(logo)}
${chalk.dim('Developed by')} ${chalk.cyan.bold('Habrmnc')} ${chalk.dim('(https://habrhmnc.dev/)')}
`);

program
    .command('start <task>')
    .description('Start tracking a specific task')
    .option('-p, --project <project>', 'Project name', 'General')
    .action((task, options) => {
        require('./commands/start')(task, options.project)
    });

program
    .command('stop')
    .description('Stop the current active tracking session')
    .action(() => {
        require('./commands/stop')()
    });

program
    .command('report')
    .description('Show detailed reports of your focus sessions')
    .option('-d, --daily', 'Today\'s focus data')
    .option('-w, --weekly', 'Last 7 days focus data')
    .option('-m, --monthly', 'Last 30 days focus data')
    .option('-f, --from <date>', 'Filter from (YYYY-MM-DD)')
    .option('-e, --to <date>', 'Filter to (YYYY-MM-DD)')
    .option('-t, --table', 'Display as a formatted table')
    .action((options) => {
        require('./commands/report')(options)
    });

program
    .command('focus <duration>')
    .description('Start a Pomodoro focus timer (minutes)')
    .option('-t, --task <task>', 'Task name', 'Focus Session')
    .option('-p, --project <project>', 'Project name', 'General')
    .action((duration, options) => {
        require('./commands/focus')(duration, options.task, options.project)
    });

program
    .command('tasks')
    .description('List past tasks and their IDs limit to 10 by default')
    .option('-a, --all', 'Show all tasks')
    .action((options) => {
        require('./commands/tasks')(options)
    });

program
    .command('update <id>')
    .description('Update an old task')
    .option('-t, --task <name>', 'New task name')
    .option('-p, --project <name>', 'New project name')
    .option('-d, --duration <mins>', 'New duration in minutes')
    .action((id, options) => {
        require('./commands/update')(id, options)
    });

program
    .command('delete <id>')
    .description('Delete an old task')
    .action((id) => {
        require('./commands/delete')(id)
    });

program
    .command('recap')
    .description('Recap today\'s focus and fill gaps')
    .action(() => {
        require('./commands/recap')()
    });

program.parse();
