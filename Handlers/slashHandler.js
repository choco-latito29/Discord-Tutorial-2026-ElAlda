const fs = require("fs");
require("colors");

module.exports = {
  async loadSlash(client) {
    const commands = [];

    for (const category of fs.readdirSync("./SlashCommands")) {
      const files = fs
        .readdirSync(`./SlashCommands/${category}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of files) {
        const command = require(`../SlashCommands/${category}/${file}`);

        client.slashCommands.set(command.data.name, command);

        commands.push(command.data.toJSON());
      }
    }

    await client.application.commands.set(commands);

    console.info(
      `✅ ${commands.length} comandos slash cargados correctamente.`.green.bold,
    );
  },
};
