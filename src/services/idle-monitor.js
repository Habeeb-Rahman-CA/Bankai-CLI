// Placeholder for uiohook-napi logic
class IdleMonitor {
  startMonitoring() {
    // In real impl: hook.on('mousemove', resetTimer)
    console.log('[IdleMonitor] Started');
  }
  stopMonitoring() {
    console.log('[IdleMonitor] Stopped');
  }
}
module.exports = IdleMonitor;
