const ora = require('ora');
const chalk = require('chalk');
const { load, save } = require('../utils/storage');
const { getIdleSeconds } = require('../utils/idle');

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
        duration: 0,
        idleMinutes: 0
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
    let totalIdleMinutes = 0;

    const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, (endTime - now) / 1000 / 60);
        
        // Idle detection
        const idleSecs = getIdleSeconds();
        if (idleSecs > 180) { // Reduced threshold for better experience (3 minutes)
            spinner.color = 'red';
            spinner.text = `${chalk.bold.red('⚠️  IDLE DETECTED')} | Time remaining: ${remaining.toFixed(2)} mins`;
            totalIdleMinutes += 1 / 60; // Approximate (every second we are idle we increment)
        } else {
            spinner.color = 'yellow';
            spinner.text = `Time remaining: ${remaining.toFixed(2)} mins`;
        }

        if (now >= endTime) {
            clearInterval(timer);
            const currentData = load();
            const session = currentData.find(s => s.start === startTime);
            if (session) {
                session.end = now;
                session.duration = minutes.toFixed(2);
                session.idleMinutes = totalIdleMinutes.toFixed(2);
                save(currentData);
            }
            
            const efficiency = Math.max(0, Math.min(100, ((minutes - totalIdleMinutes) / minutes) * 100)).toFixed(0);
            
            spinner.succeed(chalk.bold.green(`\nFocus session complete!`));
            console.log(chalk.blue(`   Total focused: ${minutes} mins`));
            console.log(chalk.yellow(`   Idle detected: ${totalIdleMinutes.toFixed(2)} mins`));
            console.log(chalk.magenta.bold(`   Focus Efficiency: ${efficiency}%`));
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
            session.idleMinutes = totalIdleMinutes.toFixed(2);
            save(currentData);
            spinner.stop();
            console.log(chalk.yellow(`\n\nSession interrupted. Saved progress: ${actualDuration} mins.`));
        }
        process.exit();
    });
};
