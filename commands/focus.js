const ora = require('ora');
const chalk = require('chalk');
const { load, save } = require('../utils/storage');

module.exports = (duration, task, project) => {
    const minutes = parseFloat(duration);
    if (isNaN(minutes)) {
        console.error(chalk.red("Invalid duration. Please provide a number in minutes."));
        return;
    }

    const data = load();
    const startTime = Date.now();
    const newSession = {
        task,
        project,
        start: startTime,
        end: null,
        duration: 0
    };
    data.push(newSession);
    save(data);

    console.log(chalk.cyan(`\nBankai mode activated!`));
    console.log(chalk.green(`Focusing on: ${task} [Project: ${project}] for ${minutes} mins.`));

    const spinner = ora({
        text: `Time remaining: ${minutes.toFixed(2)} mins`,
        color: 'yellow'
    }).start();

    const endTime = startTime + minutes * 60 * 1000;

    const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, (endTime - now) / 1000 / 60);
        spinner.text = `Time remaining: ${remaining.toFixed(2)} mins`;

        if (now >= endTime) {
            clearInterval(timer);
            const currentData = load();
            const session = currentData.find(s => s.start === startTime);
            if (session) {
                session.end = now;
                session.duration = minutes.toFixed(2);
                save(currentData);
            }
            
            spinner.succeed(chalk.bold.green(`\nFocus session complete!`));
            console.log(chalk.blue(`   Total focused: ${minutes} mins`));
            process.exit(0);
        }
    };

    const timer = setInterval(updateTimer, 1000);

    // Handle manual exit
    process.on('SIGINT', () => {
        clearInterval(timer);
        const currentData = load();
        const session = currentData.find(s => s.start === startTime);
        if (session) {
            const actualDuration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
            session.end = Date.now();
            session.duration = actualDuration;
            save(currentData);
            spinner.stop();
            console.log(chalk.yellow(`\n\nSession interrupted. Saved progress: ${actualDuration} mins.`));
        }
        process.exit();
    });
};
