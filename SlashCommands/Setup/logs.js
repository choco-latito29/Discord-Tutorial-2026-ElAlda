const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const { setData } = require("../../Events/Client/dbManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-logs")
    .setDescription("Configura el canal de logs.")
    .addChannelOption((option) =>
      option
        .setName("canal")
        .setDescription("Canal donde se enviara los logs")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    )
    .setContexts(0)
    .setIntegrationTypes(0),
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator,
      )
    ) {
      const container = new ContainerBuilder()
        .setAccentColor(0xff0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "⚠️ Este comando solo es uso para los administradores del servidor.",
          ),
        );

      await interaction.reply({
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        components: [container],
        allowedMentions: { repliedUser: false },
      });

      return;
    }

    const channel = interaction.options.getChannel("canal");

    setData("logs", interaction.guild.id, { logChannelId: channel.id });

    const container = new ContainerBuilder()
      .setAccentColor(0x00ff00)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `✅ Registro de logs configurado en ${channel}`,
        ),
      );

    await interaction.reply({
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
      components: [container],
      allowedMentions: { repliedUser: false },
    });
  },
};
