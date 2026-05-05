# 📝 Course Syllabus & Features by Episode

Technical summary of the **ELALDA** tutorial series (2026) for developing bots in Discord.js v14.

---

### 🟢 Phase 1: Foundations & Configuration

- **Episode #1:** Initialization with `npm init`, installation of `discord.js`, and management of `GatewayIntentBits`.
- **Episode #2:** Handling `ActivityType` and `setActivity` for dynamic statuses.
- **Episode #3:** Security using `dotenv` and protected `.env` files via `.gitignore`.
- **Episode #4:** Building a professional Slash Command Handler using `Collection` and `fs`.
- **Episode #5:** Mobile development environment on Android (WebCode + Markor).

### ⚡ Phase 2: Architecture & Scalability

- **Episode #6:** Implementation of a modular Event Handler (`loadEvents`).
- **Episode #7:** Automatic rotating status system using `setInterval`.

### 🛡️ Phase 3: Audit System (Logs Saga)

- **Episode #8 (Channels):** `/setlogs` command and detection of channel creation, editing, and deletion.
- **Episode #9 (Roles):** Detection of role changes (color, position, permissions) with a cooldown system.
- **Episode #10 (Messages):** Logging of `messageUpdate`, `messageDelete`, and `messageDeleteBulk` with support for image galleries (`MediaGalleryBuilder`).

### 🎨 Phase 4: Fun Commands & Canvas

- **Episode #11 (Love/Ship Command):**
  - Installation of the `@napi-rs/canvas` library (A modern, fast, Rust-based alternative to traditional canvas).
  - Image manipulation: Circular avatars, borders, and layer overlays.
  - Generation of random percentages and sending buffers via `AttachmentBuilder`.

### ⚙️ Phase 5: Server Systems & Databases

- **Episode #12 (Dynamic Auto-role System):**
  - Advanced structuring with `addSubcommand` (`add`, `view`, `delete`).
  - Implementation of **Autocomplete Interaction** for reactive option filtering (separating users from bots) and identifying "ghost" roles.
  - Discord Cybersecurity: Blocking the default `@everyone` role, filtering critical permissions (`Administrator`), and validating role hierarchy (`highest.position`).
  - Data persistence integration (JSON) using custom handlers (`getData` and `setData`).
  - Premium UI/UX interface design using `ContainerBuilder`, `TextDisplayBuilder`, and `SeparatorBuilder`.

### 🚀 Phase 6: Deployment & Production (Hosting)

- **Episode #13 (FREE 24/7 Hosting with Bot-Hosting):**
  - Initial server setup on **Bot-Hosting.net** via Discord authentication.
  - **Resource Management (Uptime):** Managing the platform's virtual economy system (claiming coins every 3 hours) to cover automatic renewal and avoid service suspension.
  - **Code Deployment (Upload):** Compressing the local project in `.RAR` or `.ZIP` format for upload through the platform's Pterodactyl/Web panel.
  - **Dependency Optimization:** Strict exclusion of the `node_modules` folder and `package-lock.json` before compression to reduce file weight and prevent compatibility errors between development and production environments.
  - Cloud extraction, Node.js environment startup, and 24/7 console execution.

### 🌐 Phase 7: Global Management & Bot Monitoring

- **Episode #14 (Server Logs & Leave Command):**
  - **Expansion Monitoring:** Implementation of `guildCreate` and `guildDelete` events to track in real-time when the bot is invited to or removed from a server.
  - **Extreme Centralized Audit:** Creation of dynamic alerts with hex colors (`0x57F287` for joins, `0xED4245` for leaves). Extraction of cache metrics, security data (Verification Levels, NSFW Filters, 2FA), and structural counters (Channels, Roles, Emojis, Boosts).
  - **Restricted Access Control (Owner Only):** Development of the `/leave` admin command with strict validation by User ID (Hardcoded) to prevent unauthorized use by third parties.
  - **Stealth Execution:** Use of `MessageFlags.Ephemeral` (Ghost Messages) to force the bot to leave specific servers invisibly and in a controlled manner.
