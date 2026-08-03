const Tracker = require('../services/tracker');
const logger = require('../utils/logger');
const chalk = require('chalk');

module.exports = async (minutes = 25, options) => {
  const duration = minutes * 60 * 1000;
  console.log(chalk.yellow(`🍅 Starting ${minutes} min Pomodoro...`));
  
  // Simple implementation - in real app use interval for UI
  setTimeout(async () => {
    console.log(chalk.green('✅ Pomodoro complete!'));
    const tracker = new Tracker();
    await tracker.logSession({
      task: options.task || 'Pomodoro',
      project: options.project,
      duration: minutes,
      type: 'pomodoro'
    });
  }, duration);
};
