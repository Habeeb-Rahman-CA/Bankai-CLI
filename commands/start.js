const {load, save} = require('../utils/storage');
const chalk = require('chalk');

module.exports = (task, project) => {
    const data = load();

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