const { uIOhook } = require('uiohook-napi');

let lastInputTime = Date.now();
let isHookActive = false;

// Reset idle timer on any keyboard or mouse activity
const resetTimer = () => {
    lastInputTime = Date.now();
};

/**
 * Safely starts the global input listener.
 * Handles platform-specific permission errors gracefully.
 */
function startListener() {
    try {
        uIOhook.on('keydown', resetTimer);
        uIOhook.on('mousedown', resetTimer);
        uIOhook.on('mousewheel', resetTimer);
        uIOhook.on('mousemove', resetTimer);

        uIOhook.start();
        isHookActive = true;
    } catch (error) {
        console.warn('\nGlobal input monitor could not be started.');
        console.warn('   Idle detection may not work correctly without proper permissions (e.g., Accessibility on macOS).');
    }
}

// Start the listener immediately
startListener();

/**
 * Returns the idle time of the user in seconds using global input events.
 * Returns 0 if the hook failed to start.
 */
function getIdleSeconds() {
    if (!isHookActive) return 0;
    return (Date.now() - lastInputTime) / 1000;
}

// Ensure uiohook is stopped when the process exits
process.on('SIGINT', () => {
    if (isHookActive) uIOhook.stop();
});

module.exports = { getIdleSeconds };
