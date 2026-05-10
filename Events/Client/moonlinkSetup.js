const { Manager } = require("moonlink.js");

module.exports = (client) => {
  if (client.manager) return;

  const nodes = [
    {
      identifier: "YOU NAME",
      host: "YOU ACCESS TO HOST",
      port: "YOU PORT",
      password: "YOU PASSWORD TO LAVALINK",
      secure: false,
      retryAmount: 5,
      retryDelay: 15000,
    },
  ];

  client.manager = new Manager({
    nodes,
    options: {
      search: {
        defaultPlatform: "youtube",
        resultLimit: 10,
        playlistLoadLimit: 100,
      },
    },
    send: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },
  });

  console.log(`[MOONLINK] Manager created successfully`);

  client.on("raw", (packet) => {
    if (
      packet.t === "VOICE_STATE_UPDATE" ||
      packet.t === "VOICE_SERVER_UPDATE"
    ) {
      client.manager.packetUpdate(packet);
    }
  });

  client.manager.on("nodeConnect", (node) => {
    console.log(`[MOONLINK] ✓ Node connected: ${node.identifier}`);
  });

  client.manager.on("nodeReconnect", (node) => {
    console.log(`[MOONLINK] ⟳ Reconnecting: ${node.identifier}`);
  });

  client.manager.on("nodeDisconnect", (node) => {
    console.log(`[MOONLINK] ✗ Disconnected: ${node.identifier}`);
  });

  client.manager.on("nodeError", (node, error) => {
    console.log(`[MOONLINK] ✗ Error on ${node.identifier}: ${error.message || error}`);
  });
};