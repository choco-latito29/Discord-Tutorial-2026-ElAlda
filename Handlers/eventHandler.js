const { readdirSync } = require("fs");
require("colors");

module.exports = {
  async loadEvents(client) {
    let cantidadEventos = 0;

    readdirSync(process.cwd() + "/Events").forEach((folder) => {
      readdirSync(process.cwd() + `/Events/${folder}`)
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
          const event = require(process.cwd() + `/Events/${folder}/${file}`);

          if (event.once) {
            client.once(event.name, (...args) =>
              event.execute(...args, client),
            );
          } else {
            client.on(event.name, (...args) => event.execute(...args, client));
          }

          cantidadEventos++;
        });
    });

    console.info(
      `✅ ${cantidadEventos} eventos cargados correctamente.`.green.bold,
    );
  },
};
