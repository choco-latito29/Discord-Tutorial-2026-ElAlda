const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde con 'Pong!' y muestra tu latencia.")
    .setContexts(0)
    .setIntegrationTypes(0),
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    const latency = Date.now() - interaction.createdTimestamp;

    const container = new ContainerBuilder()
      .setAccentColor(0x00ff00)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Pong! Latencia: \`\`${latency} ms\`\``,
        ),
      );

    await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
      allowedMentions: { repliedUser: false },
    });
  },
};
