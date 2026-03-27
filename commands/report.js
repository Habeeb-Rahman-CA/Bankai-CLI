const { load } = require('../utils/storage')
const chalk = require('chalk');

module.exports = () => {
    const data = load();

    const projectTotals = {};
    let totalOverall = 0;

    data.forEach((d) => {
        if (d.end && d.duration) {
            const project = d.project || 'Uncategorized';
            const duration = parseFloat(d.duration);
            projectTotals[project] = (projectTotals[project] || 0) + duration;
            totalOverall += duration;
        }
    })

    console.log(chalk.blue.bold("\nProject Breakdown:"));
    Object.keys(projectTotals).forEach(project => {
        console.log(`${chalk.cyan(project)}: ${projectTotals[project].toFixed(2)} mins`);
    });

    console.log(chalk.green.bold(`\nTotal Focus time: ${totalOverall.toFixed(2)} mins`));
}