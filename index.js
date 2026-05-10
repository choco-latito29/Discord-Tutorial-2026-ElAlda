const { Client, Collection } = require("discord.js");
require("dotenv").config({ quiet: true });
require("colors");

const client = new Client({ intents: 53608447 });

client.slashCommands = new Collection();

require("./Events/Client/moonlinkSetup")(client);

(async () => {
  await require("./Handlers/eventHandler").loadEvents(client);
})();

client.login(process.env.TOKEN_DISCORD_BOT);