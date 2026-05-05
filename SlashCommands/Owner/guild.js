const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("guild")
    .setDescription("Administración global de los servidores del bot.")
    .addSubcommand((command) =>
      command
        .setName("leave")
        .setDescription("Fuerza la salida del bot de un servidor específico.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Selecciona o escribe el nombre/ID del servidor.")
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .setContexts(0)
    .setIntegrationTypes(0),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    const { options } = interaction;

    const sub = options.getSubcommand();
    const id = options.getString("id");

    switch (sub) {
      case "leave":
        const guild = client.guilds.cache.get(id);

        if (!guild) {
          const container = new ContainerBuilder()
            .setAccentColor(0xfee75c)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `⚠️ **Error de Búsqueda:** No me encuentro en ningún servidor con la ID \`\`${id}\`\`.`,
              ),
            );

          await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [container],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        await guild.leave();

        const container = new ContainerBuilder()
          .setAccentColor(0x57f287)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `👋 **Desvinculación Exitosa**\n` +
                `He abandonado el servidor **${guildName}** correctamente.`,
            ),
          );

        await interaction.reply({
          flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
          components: [container],
          allowedMentions: { repliedUser: false },
        });

        break;

      default:
        break;
    }
  },

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async autocomplete(interaction) {
    const allowedUserId = "839194749444816979";

    if (interaction.user.id === allowedUserId) {
      const servers = interaction.client.guilds.cache;
      const query = interaction.options.getString("id").toLowerCase();

      const filteredServers = servers.filter(
        (guild) =>
          guild.name.toLowerCase().includes(query) || guild.id.includes(query),
      );

      const options = filteredServers
        .map((guild) => {
          const displayName = `${guild.name} (ID: ${guild.id})`;

          return {
            name:
              displayName.length > 100
                ? displayName.substring(0, 97) + "..."
                : displayName,
            value: guild.id,
          };
        })
        .slice(0, 25);

      await interaction.respond(options);
    } else {
      await interaction.respond([]);
    }
  },
};
