const { load, save } = require('../utils/storage');
const chalk = require('chalk');
const readline = require('readline');

const GAP_THRESHOLD_MINUTES = 15;

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

module.exports = async () => {
    const data = load();
    const now = new Date();
    const today = now.toDateString();

    // Filter today's tasks and sort by start time
    let todayTasks = data
        .filter(t => new Date(t.start).toDateString() === today && t.end !== null)
        .sort((a, b) => a.start - b.start);

    if (todayTasks.length === 0) {
        console.log(chalk.yellow("\nNo tasks tracked today yet. Get to work! ⚔️"));
        return;
    }

    let totalMinutes = todayTasks.reduce((acc, t) => acc + parseFloat(t.duration || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    console.log(chalk.magenta.bold(`\n✧ Today's Recap [${today}] ✧`));
    console.log(chalk.cyan(`You tracked ${chalk.white.bold(totalHours)}h today.`));

    // Find gaps
    const gaps = [];
    for (let i = 0; i < todayTasks.length - 1; i++) {
        const currentTask = todayTasks[i];
        const nextTask = todayTasks[i + 1];
        const gapMs = nextTask.start - currentTask.end;
        const gapMins = gapMs / (1000 * 60);

        if (gapMins >= GAP_THRESHOLD_MINUTES) {
            gaps.push({
                start: currentTask.end,
                end: nextTask.start,
                durationMins: gapMins.toFixed(2)
            });
        }
    }

    if (gaps.length === 0) {
        console.log(chalk.green("\nNo significant gaps detected. Great focus! 🎯\n"));
        return;
    }

    console.log(chalk.yellow(`\n${gaps.length} Gaps detected:`));
    gaps.forEach(g => {
        console.log(chalk.dim(`- ${formatTime(g.start)} → ${formatTime(g.end)} (${g.durationMins}m untracked)`));
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

    console.log(chalk.cyan("\nDo you want to fill these gaps?"));

    for (const gap of gaps) {
        console.log(chalk.white(`\nGap: ${chalk.bold(formatTime(gap.start))} → ${chalk.bold(formatTime(gap.end))} (${gap.durationMins}m)`));
        const taskName = await ask(chalk.dim("What were you doing? (Enter task name or leave blank to skip): "));
        
        if (taskName.trim()) {
            const project = await ask(chalk.dim("Project? (Default: General): ")) || "General";
            
            data.push({
                task: taskName.trim(),
                project: project.trim(),
                start: gap.start,
                end: gap.end,
                duration: gap.durationMins,
                idleMinutes: "0.00"
            });
            console.log(chalk.green("Added!"));
        } else {
            console.log(chalk.dim("Skipped."));
        }
    }

    save(data);
    rl.close();
    console.log(chalk.magenta.bold("\nRecap complete. Bankai! 🌸\n"));
};
