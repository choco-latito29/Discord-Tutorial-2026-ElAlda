# 🛡️ Security & Configuration Guide

In this project, we explore **3 methods** to handle the configuration and credentials (tokens, API keys) of your Discord Bot.

The main goal is to avoid uploading **Secrets** to GitHub to prevent hacks.

> ⚠️ **IMPORTANT:** The files included in this repository ([.env](../.env), [config.json](../config.json), [config.js](../config.js)) are **TEMPLATES**. You must edit them with your own real data.

---

## 🥇 Method 1: Environment Variables (.env)

**Status:** ✅ _Recommended (Industry Standard)_

This is the most secure way. Variables live in the operating system's environment, not in the code. It uses the [dotenv](https://www.npmjs.com/package/dotenv) library.

### 1. Edit the File ([.env](../.env))

In the repository, you will find an example `.env` file. Open it and replace the text with your real keys.

_Note: If you are going to upload your own version of the bot to GitHub, make sure your .env with real data is inside the .gitignore file._

```ini
# Edit the values inside the quotes
TOKEN_DISCORD_BOT = "YOUR BOT TOKEN GOES HERE"

KEY = "ANY OTHER SECRET KEY YOU WANT TO SAVE GOES HERE"

```

### 2. Importing ([index.js](../index.js))

This is how the bot reads these protected variables:

```javascript
const { Client, ActivityType } = require("discord.js");
require("dotenv").config({ quiet: true });
require("colors");

const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot logged in as: ${client.user.tag}`.green.bold);

  client.user.setActivity("New video on Youtube/Twitch", {
    type: ActivityType.Streaming,
    url: "[https://www.twitch.tv/el_aldas](https://www.twitch.tv/el_aldas)",
  });
});

client.login(process.env.TOKEN_DISCORD_BOT);
```

### 3. Another way to import ([index.js](../index.js))

> ⚙️ (Optional) If you use a separate file for development:

```javascript
const { Client, ActivityType } = require("discord.js");
require("dotenv").config({ quiet: true, path: ".env.development" });
require("colors");

const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot logged in as: ${client.user.tag}`.green.bold);

  client.user.setActivity("New video on Youtube/Twitch", {
    type: ActivityType.Streaming,
    url: "[https://www.twitch.tv/el_aldas](https://www.twitch.tv/el_aldas)",
  });
});

client.login(process.env.TOKEN_DISCORD_BOT);
```

---

## 🥈 Method 2: JSON File (`config.json`)

**Status:** ⚠️ _Useful for Public Configuration (Colors, Prefixes)_

It's a very clean and organized static format, but it **DOES NOT allow comments**.

### 1. Edit the File ([config.json](../config.json))

Modify the existing file with your preferences.

```json
{
  "TOKEN_DISCORD_BOT": "YOUR BOT TOKEN GOES HERE",
  "KEY": "ANY OTHER SECRET KEY YOU WANT TO SAVE GOES HERE"
}
```

### 2. Importing ([index.js](../index.js))

Node.js allows importing JSON files directly as if they were objects.

```javascript
const { Client, ActivityType } = require("discord.js");
const config = require("./config.json");
require("colors");

const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot logged in as: ${client.user.tag}`.green.bold);

  client.user.setActivity("New video on Youtube/Twitch", {
    type: ActivityType.Streaming,
    url: "[https://www.twitch.tv/el_aldas](https://www.twitch.tv/el_aldas)",
  });
});

client.login(config.TOKEN_DISCORD_BOT);
```

---

## 🥉 Method 3: JavaScript Module (`config.js`)

**Status:** ⚠️ _Versatile (Allows logic and comments)_

Unlike JSON, here you can use real JavaScript code and write explanations.

### 1. Edit the File ([config.js](../config.js))

Just like the previous ones, replace the example values.

```javascript
module.exports = {
  TOKEN_DISCORD_BOT: "YOUR BOT TOKEN GOES HERE",
  KEY: "ANY OTHER SECRET KEY YOU WANT TO SAVE GOES HERE",
};
```

### 2. Importing ([index.js](../index.js))

```javascript
const { Client, ActivityType } = require("discord.js");
const { TOKEN_DISCORD_BOT } = require("./config.js");
require("colors");

const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot logged in as: ${client.user.tag}`.green.bold);

  client.user.setActivity("New video on Youtube/Twitch", {
    type: ActivityType.Streaming,
    url: "[https://www.twitch.tv/el_aldas](https://www.twitch.tv/el_aldas)",
  });
});

client.login(TOKEN_DISCORD_BOT);
```

---

## 🆚 Comparison Table

| Feature        | `.env`               | `config.json`         | `config.js`                        |
| -------------- | -------------------- | --------------------- | ---------------------------------- |
| **Security**   | ⭐⭐⭐⭐⭐ (High)    | ⭐⭐ (Low)            | ⭐⭐ (Low)                         |
| **Comments**   | ✅ Yes (`#`)         | ❌ No                 | ✅ Yes (`//`)                      |
| **Data types** | Text Only (String)   | Text, Numbers, Arrays | Everything (Functions, Objects...) |
| **Ideal Use**  | **Tokens & Secrets** | Colors, static texts  | Complex config logic               |
