const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
  ChannelType,
  PermissionsBitField,
  SeparatorBuilder,
} = require("discord.js");
const { setData } = require("../../Events/Client/dbManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("📡 Configure the server's audit logging system.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("🛰️ Select the text channel for event logs.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    )
    .setContexts(0)
    .setIntegrationTypes(0),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    const { guild, member, options } = interaction;

    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      const container = new ContainerBuilder()
        .setAccentColor(0xff0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "⚠️ **Permission Denied:** This command is restricted to Server Administrators only.",
          ),
        );

      await interaction.reply({
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        components: [container],
        allowedMentions: { repliedUser: false },
      });

      return;
    }

    const channel = options.getChannel("channel");

    setData("logs", guild.id, { logChannelId: channel.id });

    const container = new ContainerBuilder()
      .setAccentColor(0x57f287)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ✅ System Audit Configured"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `📡 **Logging Channel:** ${channel}\n` +
            `🆔 **Channel ID:** \`\`${channel.id}\`\`\n` +
            `📅 **Updated at:** <t:${Math.floor(Date.now() / 1000)}:f>\n\n` +
            `> *All server events (messages, roles, channels) will now be reported to this location.*`,
        ),
      );

    await interaction.reply({
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
      components: [container],
      allowedMentions: { repliedUser: false },
    });
  },
};
