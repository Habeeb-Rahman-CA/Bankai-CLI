const { load } = require('../utils/storage');
const chalk = require('chalk');
const Table = require('cli-table3');

module.exports = (options = {}) => {
    const data = load();
    if (data.length === 0) {
        console.log(chalk.red("   No tasks found."));
        return;
    }

    let limit = options.all ? data.length : 10;
    
    // List the last N tasks, but keep their original IDs (index + 1)
    const startIndex = Math.max(0, data.length - limit);
    
    const table = new Table({
        head: [chalk.cyan('ID'), chalk.cyan('PROJECT'), chalk.cyan('TASK'), chalk.cyan('START'), chalk.cyan('DURATION')],
        style: { head: [], border: [] }
    });

    for (let i = startIndex; i < data.length; i++) {
        const d = data[i];
        const id = i + 1;
        const dateStr = new Date(d.start).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        table.push([
            chalk.yellow(id),
            chalk.magenta(d.project || 'General'),
            chalk.white(d.task || 'Unnamed Task'),
            chalk.dim(dateStr),
            d.duration ? `${d.duration} m` : 'Running'
        ]);
    }

    console.log(chalk.yellow.bold(`\nRecent Tasks (Showing last ${Math.min(limit, data.length)})`));
    console.log(`\n${table.toString()}\n`);
};
