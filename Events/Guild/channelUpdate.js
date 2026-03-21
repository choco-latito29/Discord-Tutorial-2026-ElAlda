const {
  AuditLogEvent,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "channelUpdate",
  on: true,
  /**
   *
   * @param {import("discord.js").Channel} channel
   * @param {import("discord.js").Client} client
   */
  async execute(oldChannel, newChannel, client) {
    if (!oldChannel.guild) return;

    const config = getData("logs", oldChannel.guild.id);

    if (!config || !config.logChannelId) return;

    const logChannel = oldChannel.guild.channels.cache.get(config.logChannelId);

    if (!logChannel) return;

    if (oldChannel.name === newChannel.name) return;

    const fetchLogs = await oldChannel.guild
      .fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelUpdate })
      .catch(() => null);

    const logEntry = fetchLogs ? fetchLogs.entries.first() : null;
    const executor = logEntry ? logEntry.executor : "Desconocido";

    const container = new ContainerBuilder()
      .setAccentColor(0x00ffff)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## 🤔 Canal Actualizado"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Se ha actualizado el canal: **${oldChannel.name}**\n\n` +
            `😀 Editado por: ${executor}\n` +
            `⚙️ Nombre Anterior: ${oldChannel.name}\n` +
            `⚙️ Nombre Nuevo: ${newChannel.name}`,
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
