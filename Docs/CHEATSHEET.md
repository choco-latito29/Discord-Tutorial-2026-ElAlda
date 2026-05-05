# ⚡ Cheat Sheet (Discord.js v14)

Quick reference for the variables and statuses used in the **ELALDA 2026** course.

## 🎭 Bot Statuses (ActivityType)

To use these statuses, import them with `const { ActivityType } = require("discord.js");`

| Code                     | Description        | Visual Example                     |
| :----------------------- | :----------------- | :--------------------------------- |
| `ActivityType.Playing`   | 🎮 Playing...      | _Playing Visual Studio Code_       |
| `ActivityType.Watching`  | 👀 Watching...     | _Watching the users_               |
| `ActivityType.Listening` | 🎧 Listening to... | _Listening to Spotify_             |
| `ActivityType.Competing` | 🏆 Competing in... | _Competing in Tournament_          |
| `ActivityType.Streaming` | 🟣 Streaming...    | _Live on Twitch_ (Requires URL)    |
| `ActivityType.Custom`    | 💬 Custom          | _(Only text and emoji, no prefix)_ |

## 🟢 Status Colors (Status)

These control the color of the small circle that appears on the bot's profile picture.

| Status Code | Color / View | Description                             |
| :---------- | :----------: | :-------------------------------------- |
| `online`    |   🟢 Green   | The bot is online and working normally. |
| `idle`      |  🌙 Orange   | Away or idle.                           |
| `dnd`       |    🔴 Red    | Do Not Disturb.                         |
| `invisible` |   ⚪ Gray    | Appears offline, **but keeps running**. |

## 🔄 Auto-Rotation Template

Copy and paste this array into your `ready.js` event to have rotating statuses (Episode #7):

```javascript
const estados = [
  { name: "Minecraft", type: ActivityType.Playing, status: "online" },
  {
    name: "ElAlda on Twitch",
    type: ActivityType.Streaming,
    url: "[https://www.twitch.tv/elaldass](https://www.twitch.tv/elaldass)",
    status: "online",
  },
  { name: "Sweeping my house", type: ActivityType.Custom, status: "idle" },
];
```

---

## 🛠️ Magic Variables (Client)

Use these variables inside your `console.log` or statuses to display real data.

### 📊 Server Statistics

| Variable                                                     | What it returns                  | Example |
| ------------------------------------------------------------ | -------------------------------- | ------- |
| `client.guilds.cache.size`                                   | Server Count                     | `5`     |
| `client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)` | Total Users (Sum of all servers) | `1450`  |
| `client.channels.cache.size`                                 | Total Channels (Text + Voice)    | `34`    |
| `client.emojis.cache.size`                                   | Emojis the bot can see           | `20`    |

### 🤖 Bot Identity

| Variable                                     | Description          | Example        |
| -------------------------------------------- | -------------------- | -------------- |
| `client.user.tag`                            | Name + Discriminator | `YourBot#1234` |
| `client.user.username`                       | Only the name        | `YourBot`      |
| `client.user.id`                             | Unique bot ID        | `982374...`    |
| `client.user.createdAt.toLocaleDateString()` | Creation date        | `1/2/2026`     |

### ⚙️ Technical Data (Nerd Stats)

| Variable                                                    | Description     | Example    |
| ----------------------------------------------------------- | --------------- | ---------- |
| `client.ws.ping`                                            | Latency (Ping)  | `45ms`     |
| `process.version`                                           | Node.js Version | `v22.0.0`  |
| `(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)` | RAM Memory used | `25.50 MB` |

---

> 💡 **Note:** Some variables like the user count might take a few seconds to become available right after turning on the bot (`clientReady`).
