const Store = require('../data/store');
const logger = require('../utils/logger');

module.exports = async (tagsStr) => {
  const store = new Store();
  const tags = tagsStr.split(',').map(t => t.trim());
  
  try {
    store.addTagsToActiveSession(tags);
    logger.success(`Tags added: ${tags.join(', ')}`);
  } catch (e) {
    logger.error(e.message);
  }
};
