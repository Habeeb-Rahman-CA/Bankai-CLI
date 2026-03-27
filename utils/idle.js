const { uIOhook } = require('uiohook-napi');

let lastInputTime = Date.now();

// Reset idle timer on any keyboard or mouse activity
const resetTimer = () => {
    lastInputTime = Date.now();
};

uIOhook.on('keydown', resetTimer);
uIOhook.on('mousedown', resetTimer);
uIOhook.on('mousewheel', resetTimer);
uIOhook.on('mousemove', resetTimer);

uIOhook.start();

/**
 * Returns the idle time of the user in seconds using global input events.
 */
function getIdleSeconds() {
    return (Date.now() - lastInputTime) / 1000;
}

// Ensure uiohook is stopped when the process exits
process.on('SIGINT', () => {
    uIOhook.stop();
});

module.exports = { getIdleSeconds };
