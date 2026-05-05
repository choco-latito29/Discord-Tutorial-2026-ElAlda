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
    .setDescription("🌐 Global administration of the bot's servers.")
    .addSubcommand((command) =>
      command
        .setName("leave")
        .setDescription("🚪 Forces the bot to leave a specific server.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("🆔 Select or type the server Name/ID.")
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
                `⚠️ **Search Error:** I am not in any server with the ID \`\`${id}\`\`.`,
              ),
            );

          await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [container],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        const targetName = guild.name;
        const targetId = guild.id;
        await guild.leave();

        const container = new ContainerBuilder()
          .setAccentColor(0x57f287)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `✅ **Departure Successful**\n\n` +
                `👋 **Server:** \`\`${targetName}\`\`\n` +
                `🆔 **ID:** \`\`${targetId}\`\`\n` +
                `📅 **Date:** <t:${Math.floor(Date.now() / 1000)}:f>\n\n` +
                `> *The bot has been disconnected from the guild and its local cache has been cleared.*`,
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
   * @param {import("discord.js").AutocompleteInteraction} interaction
   */
  async autocomplete(interaction) {
    const allowedUserId = process.env.DEVELOPERS_ID
      ? process.env.DEVELOPERS_ID.split(",").map((id) => id.trim())
      : [];

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
