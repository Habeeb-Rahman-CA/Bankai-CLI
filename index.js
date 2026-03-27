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
    .action((task) => {
        require('./commands/start')(task)
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
