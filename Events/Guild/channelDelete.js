const {
  AuditLogEvent,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "channelDelete",
  on: true,
  /**
   *
   * @param {import("discord.js").Channel} channel
   * @param {import("discord.js").Client} client
   */
  async execute(channel, client) {
    if (!channel.guild) return;

    const config = getData("logs", channel.guild.id);

    if (!config || !config.logChannelId) return;

    const logChannel = channel.guild.channels.cache.get(config.logChannelId);

    if (!logChannel) return;

    const fetchLogs = await channel.guild
      .fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete })
      .catch(() => null);

    const logEntry = fetchLogs ? fetchLogs.entries.first() : null;
    const executor = logEntry ? logEntry.executor : "Desconocido";

    const container = new ContainerBuilder()
      .setAccentColor(0xffa500)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## 🚮 Canal Eliminado"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Se ha eliminado el canal: **${channel.name}**\n\n` +
            `😀 Eliminado por: ${executor}\n` +
            `⚙️ Id del Canal: \`\`${channel.id}\`\``,
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**Time:** ${new Date().toLocaleString()}`,
        ),
      );

    await logChannel
      .send({
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        components: [container],
        allowedMentions: { repliedUser: false },
      })
      .catch(() => null);
  },
};
