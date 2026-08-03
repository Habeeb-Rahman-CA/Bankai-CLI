const Exporter = require('../services/exporter');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

module.exports = async (options) => {
  const exporter = new Exporter();
  const format = options.format;
  const data = exporter.getData(options);
  
  let content;
  let ext;
  
  if (format === 'csv') {
    content = exporter.toCSV(data);
    ext = 'csv';
  } else {
    content = JSON.stringify(data, null, 2);
    ext = 'json';
  }
  
  const filename = options.output || `bankai-export.${ext}`;
  fs.writeFileSync(path.resolve(filename), content);
  logger.success(`Data exported to ${filename}`);
};
