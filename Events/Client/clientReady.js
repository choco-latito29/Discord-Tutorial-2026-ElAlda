const { ActivityType } = require("discord.js");
require("colors");

module.exports = {
  name: "clientReady",
  once: true,
  /**
   *
   * @param {import("discord.js").Client} client
   */
  async execute(client) {
    console.info(`Bot encendido como: ${client.user.tag}`.green.bold);

    await require("./Handlers/slashHandler").loadSlash(client);

    const estados = [
      {
        name: "Aldas Tutorial",
        type: ActivityType.Playing,
        status: "online",
      },
      {
        name: "Aldas Videos",
        type: ActivityType.Playing,
        status: "online",
      },
      {
        name: "Bot Tutorial",
        type: ActivityType.Playing,
        status: "online",
      },
      {
        name: "DiscordJS",
        type: ActivityType.Playing,
        status: "online",
      },
    ];

    let i = 0;

    setInterval(async () => {
      const actual = estados[i];

      client.user.setPresence({
        activities: [
          {
            name: actual.name,
            type: actual.type,
            url: actual.url ?? null,
          },
        ],

        status: actual.status,
      });
      i = (i + 1) % estados.length;
    }, 5000);
  },
};
