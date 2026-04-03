const { load, save } = require('../utils/storage');
const chalk = require('chalk');

module.exports = (idStr, options = {}) => {
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
        console.log(chalk.red('Invalid ID.'));
        return;
    }

    const data = load();
    const index = id - 1;

    if (index < 0 || index >= data.length) {
        console.log(chalk.red(`Task with ID ${id} not found.`));
        return;
    }

    let updated = false;
    const taskObj = data[index];

    if (options.task !== undefined) {
        taskObj.task = options.task;
        updated = true;
    }
    if (options.project !== undefined) {
        taskObj.project = options.project;
        updated = true;
    }
    if (options.duration !== undefined) {
        taskObj.duration = String(options.duration);
        updated = true;
    }

    if (updated) {
        save(data);
        console.log(chalk.green(`Task ${id} updated successfully.`));
    } else {
        console.log(chalk.yellow(`No updates provided for Task ${id}. Use --task, --project, or --duration.`));
    }
};
