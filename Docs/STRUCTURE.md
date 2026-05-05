# 🏗️ Project Structure

This document explains the file organization within the **Discord Tutorial 2026** repository, reflecting the full architecture of the Choco Factory.

## 📂 Directory Tree

```text
.
├── .github/              # GitHub Configuration & Automation
│   ├── workflows/        # Automated robots (CI, Security, Releases, Greeter)
│   ├── ISSUE_TEMPLATE/   # Standardized bug, feature, and security reports
│   ├── pull_request_template.md # Template for code contributions
│   ├── SECURITY.md       # Reporting vulnerabilities policy
│   ├── CODE_OF_CONDUCT.md # Community standards
│   ├── CONTRIBUTING.md   # Guidelines for contributors
│   ├── FUNDING.yml       # Sponsorship and support links
│   └── dependabot.yml    # Automated dependency updates
├── Docs/                 # Project documentation and guides
│   ├── CHEATSHEET.md     # Quick reference for D.js v14
│   ├── SECURITY_GUIDE.md # Config & Environment variables guide
│   ├── TEMARIO.md        # Episode-by-episode syllabus
│   ├── FAQ.md            # Frequently Asked Questions
│   ├── RESOURCES.md      # External links and tools
│   └── STRUCTURE.md      # This file
├── Database/             # Local persistence files (JSON)
│   ├── logs.json         # Storage for logging configurations
│   └── autorole.json     # Storage for auto-role settings
├── Events/               # Event Handler modular folders
│   ├── Client/           # Bot status and global lifecycle events
│   ├── Guild/            # Server auditing (Messages, Roles, Channels)
│   └── Interaction/      # Slash Command & Autocomplete logic
├── Handlers/             # Core automation for loading code
│   ├── slashHandler.js   # Dynamic Slash Command registration
│   └── eventHandler.js   # Dynamic Event loading
├── SlashCommands/        # Command categories
│   ├── Utils/            # General tools (Ping, Ship/Canvas)
│   ├── Setup/            # Administrative config (Logs, Autorole)
│   ├── Owner/            # Restricted developer commands
│   └── Test/             # Debugging and testing commands
├── index.js              # Entry point of the bot
├── .env                  # Private environment variables (Secrets)
├── .gitignore            # Files excluded from the repository
├── config.json           # Public configuration and settings
├── package.json          # Project dependencies and scripts
```

## 🛠️ Key Directories Explained

### 📡 `Events/`

The heart of the bot's reactivity, divided into three specialized areas:

- **Client**: Manages the bot's connection, database manager (`dbManager.js`), and server growth tracking (`guildCreate`/`guildDelete`).
- **Guild**: The core of the audit system. It monitors every change in channels, roles, and messages.
- **Interaction**: Manages how the bot responds to commands and provides real-time suggestions via Autocomplete.

### 🔌 `SlashCommands/`

Organized by utility to keep the code scalable:

- **Setup**: Contains advanced logic for `/logs` and `/autorole`.
- **Utils**: Includes the `@napi-rs/canvas` implementation for the `/ship` command.
- **Owner**: Includes the `/leave` command with strict ID validation for security.

### 📂 `Database/`

Handles data persistence using lightweight JSON files. This ensures the bot remembers server settings (like log channels) even after a restart.

### 🤖 `Handlers/`

The automation engine. These scripts use the `fs` module to scan your folders and automatically register every command and event without manual imports in `index.js`.
