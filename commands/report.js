const { load } = require('../utils/storage')
const chalk = require('chalk');
const Table = require('cli-table3');

module.exports = (options = {}) => {
    let data = load();
    const now = new Date();

    if (options.daily) {
        const today = now.toDateString();
        data = data.filter(d => new Date(d.start).toDateString() === today);
        console.log(chalk.yellow.bold(`\nToday's Report [${today}]`));
    } else if (options.weekly) {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        data = data.filter(d => d.start >= lastWeek.getTime());
        console.log(chalk.yellow.bold(`\nWeekly Report [Last 7 Days]`));
    } else if (options.monthly) {
        const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        data = data.filter(d => d.start >= lastMonth.getTime());
        console.log(chalk.yellow.bold(`\nMonthly Report [Last 30 Days]`));
    } else if (options.from || options.to) {
        const fromDate = options.from ? new Date(options.from) : new Date(0);
        const toDate = options.to ? new Date(options.to) : new Date();
        
        // Ensure "to" covers the whole day if just YYYY-MM-DD
        if (options.to && options.to.length === 10) {
            toDate.setHours(23, 59, 59, 999);
        }

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            console.error(chalk.red("Invalid date format. Use YYYY-MM-DD."));
            return;
        }

        data = data.filter(d => d.start >= fromDate.getTime() && d.start <= toDate.getTime());
        console.log(chalk.yellow.bold(`\n📅 Range: [${fromDate.toDateString()}] to [${toDate.toDateString()}]`));
    } else {
        console.log(chalk.yellow.bold(`\nAll-time Summary`));
    }

    if (data.length === 0) {
        console.log(chalk.red("   No focus data found for this period."));
        return;
    }

    const dates = {};
    let totalOverall = 0;

    data.forEach((d) => {
        if (d.end && d.duration) {
            const projectName = d.project || 'General';
            const taskName = d.task || 'Unnamed Task';
            const duration = parseFloat(d.duration);
            const idle = parseFloat(d.idleMinutes || 0);
            const date = new Date(d.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const taskKey = `${projectName} | ${taskName}`;
            
            if (!dates[date]) {
                dates[date] = { tasks: {}, total: 0 };
            }
            
            if (!dates[date].tasks[taskKey]) {
                dates[date].tasks[taskKey] = { total: 0, idle: 0, project: projectName, name: taskName };
            }
            
            dates[date].tasks[taskKey].total += duration;
            dates[date].tasks[taskKey].idle += idle;
            dates[date].total += duration;
            totalOverall += duration;
        }
    })

    if (options.table) {
        const table = new Table({
            head: [chalk.cyan('DATE'), chalk.cyan('PROJECT'), chalk.cyan('TASK'), chalk.cyan('TOTAL (m)'), chalk.cyan('IDLE (m)'), chalk.cyan('EFF.')],
            style: { head: [], border: [] }
        });

        Object.keys(dates).forEach(date => {
            const dayData = dates[date];
            Object.keys(dayData.tasks).forEach((taskKey, idx) => {
                const task = dayData.tasks[taskKey];
                const efficiency = task.total > 0 ? (((task.total - task.idle) / task.total) * 100).toFixed(0) : 100;
                
                table.push([
                    idx === 0 ? chalk.magenta.bold(date.toUpperCase()) : '',
                    chalk.dim(task.project),
                    chalk.white(task.name),
                    task.total.toFixed(2),
                    task.idle.toFixed(2),
                    `${efficiency}%`
                ]);
            });
        });

        console.log(`\n${table.toString()}`);
    } else {
        console.log(chalk.magenta.bold("\n   ✧ Detailed Daily Report ✧"));
        
        Object.keys(dates).forEach(date => {
            const dayData = dates[date];
            console.log(`\n   ${chalk.magenta.bold(date.toUpperCase())}`);
            
            Object.keys(dayData.tasks).forEach(taskKey => {
                const task = dayData.tasks[taskKey];
                const efficiency = task.total > 0 ? (((task.total - task.idle) / task.total) * 100).toFixed(0) : 100;
                const extraInfo = task.idle > 0 ? ` ${chalk.dim(`(Idle: ${task.idle.toFixed(2)}m | ${efficiency}%)`)}` : '';
                console.log(`     - ${chalk.white(taskKey.padEnd(25))} : ${task.total.toFixed(2)} mins${extraInfo}`);
            });
            
            console.log(`     ${chalk.dim('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}`);
            console.log(`     ${chalk.yellow.bold("Daily Total".padEnd(25))} : ${dayData.total.toFixed(2)} mins`);
        });
    }

    console.log(`\n   ${chalk.green.bold('══════════════════════════════════════════')}`);
    console.log(`   ${chalk.green.bold("Overall Focus Time".padEnd(25))} : ${totalOverall.toFixed(2)} mins\n`);
}