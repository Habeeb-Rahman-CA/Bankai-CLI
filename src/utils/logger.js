const chalk = require('chalk');

module.exports = {
  success: (msg) => console.log(chalk.green('✔'), msg),
  error: (msg) => console.log(chalk.red('✖'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
};
