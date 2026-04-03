const {
  AuditLogEvent,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "messageDeleteBulk",
  on: true,
  /**
   *
   * @param {import("discord.js").Message>} messages
   * @param {import("discord.js").GuildTextBasedChannel} channel
   * @param {import("discord.js").Client} client
   */
  async execute(messages, channel, client) {
    const guild = messages.first()?.guild;
    if (!guild) return;

    const config = getData("logs", channel.guild.id);
    if (!config || !config.logChannelId) return;

    const logChannel = channel.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return;

    const fetchLogs = await channel.guild
      .fetchAuditLogs({ limit: 1, type: AuditLogEvent.MessageDeleteBulk })
      .catch(() => null);

    const logEntry = fetchLogs ? fetchLogs.entries.first() : null;
    let executor = "Desconocido (Probablemente un Bot sin registro)";

    if (logEntry && logEntry.target.id === channel.id) {
      const tiempo = Date.now() - logEntry.createdTimestamp;
      if (tiempo < 5000) {
        executor = `<@${logEntry.executor.id}>`;
      }
    }

    const container = new ContainerBuilder()
      .setAccentColor(0xe67e22)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## 🧹 Borrado Masivo (Purge)"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Se ha ejecutado una limpieza masiva de mensajes en el servidor.\n\n` +
            `**📄 Detalles de la Acción:**\n` +
            `> 💬 **Canal afectado:** <#${channel.id}>\n` +
            `> 📊 **Mensajes eliminados:** \`${messages.size}\` mensajes\n` +
            `> 🕵️ **Ejecutado por:** ${executor}`,
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `⏱️ **Fecha:** <t:${Math.floor(Date.now() / 1000)}:F> (<t:${Math.floor(Date.now() / 1000)}:R>)`,
        ),
      );

    await logChannel
      .send({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
        allowedMentions: { repliedUser: false },
      })
      .catch(() => null);
  },
};
