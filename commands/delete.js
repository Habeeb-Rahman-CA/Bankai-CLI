const { load, save } = require('../utils/storage');
const chalk = require('chalk');

module.exports = (idStr) => {
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

    data.splice(index, 1);
    save(data);
    console.log(chalk.green(`Task ${id} deleted successfully.`));
};
