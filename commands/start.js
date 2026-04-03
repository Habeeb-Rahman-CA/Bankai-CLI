const {load, save} = require('../utils/storage');
const chalk = require('chalk');

module.exports = (task, project) => {
    const data = load();

    const last = data.find(t => t.end === null);
    if (last) {
        console.log(chalk.yellow("You already have an active task."));
        console.log(chalk.yellow("Auto-stopping previous task...\n"));
        
        last.end = Date.now();
        const duration = ((last.end - last.start) / 1000 / 60).toFixed(2);
        last.duration = duration;
        
        console.log(chalk.red(`Session ended for project: ${last.project || 'General'}. Duration: ${duration} mins\n`));
    }

    data.push({
        task,
        project,
        start: Date.now(),
        end: null,
        duration: 0
    })

    save(data);
    console.log(chalk.green(`Bankai ${task} (Project: ${project})`))
}