const { Client } = require("discord.js");

const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot encendido como: ${client.user.tag}`);
});

client.login("TOKEN_BOT_AQUI");
