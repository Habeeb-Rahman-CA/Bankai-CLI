const {load, save} = require('../utils/storage');
const chalk = require('chalk');

module.exports = () => {
    const data = load();

    const last = data.find(t => t.end === null);

    if (!last) {
        console.log("No active session")
        return
    }
    
    last.end = Date.now();
    
    const duration = ((last.end - last.start) / 1000 / 60).toFixed(2);
    last.duration = duration;

    save(data)
    console.log(chalk.red(`Session ended. Duration: ${duration} mins`))
}