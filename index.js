const { Client, ActivityType, Collection } = require("discord.js");
require("dotenv").config({ quiet: true });
const fs = require("fs");
require("colors");

const client = new Client({ intents: 53608447 });

client.slashCommands = new Collection();

for (const file of fs
  .readdirSync("./Events")
  .filter((f) => f.endsWith(".js"))) {
  const event = require(`./Events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.once("clientReady", async () => {
  console.log(`Bot encendido como: ${client.user.tag}`.green.bold);

  client.user.setActivity("Nuevo video en Youtube", {
    type: ActivityType.Streaming,
    url: "https://www.twitch.tv/el_aldas",
  });

  await require("./Handlers/slashHandler").loadSlash(client);
});

client.login(process.env.TOKEN_DISCORD_BOT);
