# Bankai CLI

The ultimate productivity tool for developers. Track time, manage sprints, sync with Jira/GitHub/Notion, and analyze your focus patterns.

## Features

- **Time Tracking**: Start/stop tasks with `bankai start`
- **Pomodoro**: Built-in timer with `bankai pomodoro`
- **Sprints**: Manage goals with `bankai sprint`
- **Sync**: Integrate with Jira, GitHub, Notion
- **Analytics**: Trends, comparisons, and distraction heatmaps
- **Webhooks**: Automate workflows
- **Notifications**: Desktop alerts

## Installation

```bash
npm install -g @habrmnc/bankai
```

## Usage

```bash
bankai start "Fix Bug" -p "ProjectX"
bankai pomodoro 25
bankai sprint -n "Q4 Goals" -d 14
bankai report weekly
```

## Structure

- `bin/`: Entry point
- `src/commands/`: CLI command definitions
- `src/services/`: Business logic
- `src/data/`: Persistence layer
