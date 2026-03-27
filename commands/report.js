const { load } = require('../utils/storage')
const chalk = require('chalk');

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
            
            if (!projects[projectName]) {
                projects[projectName] = { tasks: {}, total: 0 };
            }
            
            projects[projectName].tasks[taskName] = (projects[projectName].tasks[taskName] || 0) + duration;
            projects[projectName].total += duration;
            totalOverall += duration;
        }
    })

    console.log(chalk.magenta.bold("\n   ✧ Detailed Project Report ✧"));
    
    Object.keys(projects).forEach(projectName => {
        const project = projects[projectName];
        console.log(`\n   ${chalk.magenta.bold(projectName.toUpperCase())}`);
        
        Object.keys(project.tasks).forEach(taskName => {
            console.log(`     - ${chalk.white(taskName.padEnd(25))} : ${project.tasks[taskName].toFixed(2)} mins`);
        });
        
        console.log(`     ${chalk.dim('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}`);
        console.log(`     ${chalk.yellow.bold("Project Total".padEnd(25))} : ${project.total.toFixed(2)} mins`);
    });

    console.log(`\n   ${chalk.green.bold('══════════════════════════════════════════')}`);
    console.log(`   ${chalk.green.bold("Overall Focus Time".padEnd(25))} : ${totalOverall.toFixed(2)} mins\n`);
}