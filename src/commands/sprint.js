const Store = require('../data/store');
const logger = require('../utils/logger');
const Table = require('cli-table3');
const { v4: uuidv4 } = require('uuid');

module.exports = async (name, options) => {
  const store = new Store();
  
  if (options.list) {
    const sprints = store.getSprints();
    const table = new Table({ head: ['ID', 'Name', 'Goal', 'Target (h)', 'Status'] });
    sprints.forEach(s => {
      table.push([s.id.slice(0,8), s.name, s.goal, s.targetHours, s.completed ? 'Done' : 'Active']);
    });
    console.log(table.toString());
    return;
  }

  if (options.complete) {
    store.completeSprint(options.complete);
    logger.success('Sprint marked as complete');
    return;
  }

  if (name && options.name) {
    const sprint = {
      id: uuidv4(),
      name: options.name,
      goal: options.goal || 'No goal set',
      targetHours: parseInt(options.days) * 4 || 40,
      startDate: new Date().toISOString(),
      completed: false
    };
    store.addSprint(sprint);
    logger.success(`Sprint "${sprint.name}" created!`);
  } else {
    logger.info('Usage: bankai sprint -n "Name" -d 14 -g "Goal"');
  }
};
