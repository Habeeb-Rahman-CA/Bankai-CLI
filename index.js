#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();

program
    .name('bankai')
    .description('Enter your flow state!')
    .version('1.0.0');

program
    .command('start <task>')
    .description('Start tracking')
    .option('-p, --project <project>', 'Project name', 'General')
    .action((task, options) => {
        require('./commands/start')(task, options.project)
    });

program
    .command('stop')
    .description('Stop tracking')
    .action(() => {
        require('./commands/stop')()
    })

program
    .command('report')
    .description('Show your reports')
    .option('-d, --daily', 'Show today\'s report')
    .option('-w, --weekly', 'Show this week\'s report')
    .option('-m, --monthly', 'Show this month\'s report')
    .option('-f, --from <date>', 'Filter from date (YYYY-MM-DD)')
    .option('-e, --to <date>', 'Filter to date (YYYY-MM-DD)')
    .option('-t, --table', 'Show report as a table')
    .action((options) => {
        require('./commands/report')(options)
    })

program
    .command('focus <duration>')
    .description('Pomodoro focus session')
    .option('-t, --task <task>', 'Task name', 'Focus Session')
    .option('-p, --project <project>', 'Project name', 'General')
    .action((duration, options) => {
        require('./commands/focus')(duration, options.task, options.project)
    })

program.parse();
