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
    } else {
        console.log(chalk.yellow.bold(`\nAll-time Summary`));
    }

    if (data.length === 0) {
        console.log(chalk.red("   No focus data found for this period."));
        return;
    }

    const projects = {};
    let totalOverall = 0;

    data.forEach((d) => {
        if (d.end && d.duration) {
            const projectName = d.project || 'General';
            const taskName = d.task || 'Unnamed Task';
            const duration = parseFloat(d.duration);
            const idle = parseFloat(d.idleMinutes || 0);
            
            if (!projects[projectName]) {
                projects[projectName] = { tasks: {}, total: 0 };
            }
            
            if (!projects[projectName].tasks[taskName]) {
                projects[projectName].tasks[taskName] = { total: 0, idle: 0 };
            }
            
            projects[projectName].tasks[taskName].total += duration;
            projects[projectName].tasks[taskName].idle += idle;
            projects[projectName].total += duration;
            totalOverall += duration;
        }
    })

    if (options.table) {
        const table = new Table({
            head: [chalk.cyan('PROJECT'), chalk.cyan('TASK'), chalk.cyan('TOTAL (m)'), chalk.cyan('IDLE (m)'), chalk.cyan('EFF.')],
            style: { head: [], border: [] }
        });

        Object.keys(projects).forEach(projectName => {
            const project = projects[projectName];
            Object.keys(project.tasks).forEach((taskName, idx) => {
                const task = project.tasks[taskName];
                const efficiency = task.total > 0 ? (((task.total - task.idle) / task.total) * 100).toFixed(0) : 100;
                
                table.push([
                    idx === 0 ? chalk.magenta.bold(projectName.toUpperCase()) : '',
                    chalk.white(taskName),
                    task.total.toFixed(2),
                    task.idle.toFixed(2),
                    `${efficiency}%`
                ]);
            });
        });

        console.log(`\n${table.toString()}`);
    } else {
        console.log(chalk.magenta.bold("\n   ✧ Detailed Project Report ✧"));
        
        Object.keys(projects).forEach(projectName => {
            const project = projects[projectName];
            console.log(`\n   ${chalk.magenta.bold(projectName.toUpperCase())}`);
            
            Object.keys(project.tasks).forEach(taskName => {
                const task = project.tasks[taskName];
                const efficiency = task.total > 0 ? (((task.total - task.idle) / task.total) * 100).toFixed(0) : 100;
                const extraInfo = task.idle > 0 ? ` ${chalk.dim(`(Idle: ${task.idle.toFixed(2)}m | ${efficiency}%)`)}` : '';
                console.log(`     - ${chalk.white(taskName.padEnd(25))} : ${task.total.toFixed(2)} mins${extraInfo}`);
            });
            
            console.log(`     ${chalk.dim('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}`);
            console.log(`     ${chalk.yellow.bold("Project Total".padEnd(25))} : ${project.total.toFixed(2)} mins`);
        });
    }

    console.log(`\n   ${chalk.green.bold('══════════════════════════════════════════')}`);
    console.log(`   ${chalk.green.bold("Overall Focus Time".padEnd(25))} : ${totalOverall.toFixed(2)} mins\n`);
}