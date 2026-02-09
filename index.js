const { Client, ActivityType } = require("discord.js");
require("dotenv").config({ quiet: true, path: "" });
require("colors");

const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot encendido como: ${client.user.tag}`.green.bold);

  client.user.setActivity("Nuevo video en Youtube/Twitch", {
    type: ActivityType.Streaming,
    url: "https://www.twitch.tv/el_aldas",
  });
});

client.login(process.env.TOKEN_DISCORD_BOT);
