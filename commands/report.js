const { load } = require('../utils/storage')
const chalk = require('chalk');

module.exports = () => {
    const data = load();

    let total = 0;

    data.forEach((d) => {
        if (d.end && d.duration) {
            total += parseFloat(d.duration);
        }
    })

    console.log(chalk.blue.bold(`Total Focus time: ${total.toFixed(2)} mins`));
}