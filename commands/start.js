const {load, save} = require('../utils/storage');
const chalk = require('chalk');

module.exports = (task) => {
    const data = load();

    data.push({
        task,
        start: Date.now(),
        end: null,
        duration: 0
    })

    save(data);
    console.log(chalk.green(`Bankai ${task}`))
}