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
    .action(() => {
        require('./commands/report')()
    })

program.parse();
