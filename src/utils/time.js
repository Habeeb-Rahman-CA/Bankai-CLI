module.exports = {
  formatDuration: (ms) => {
    const mins = Math.floor(ms / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  },
  formatDate: (dateStr) => new Date(dateStr).toLocaleDateString(),
};
