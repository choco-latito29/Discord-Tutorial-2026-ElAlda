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
      .setAccentColor(0xe74c3c)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ❌ Canal Eliminado"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Se ha detectado la eliminación permanente de un canal del servidor. Aquí están los últimos datos conocidos:\n\n` +
            `**📄 Información del Canal Eliminado:**\n` +
            `> 🏷️ **Nombre:** ${channel.name}\n` +
            `> 🆔 **ID:** \`${channel.id}\`\n\n` +
            `**🛠️ Detalles de la Acción:**\n\n` +
            `> 🗑️ **Eliminado por:** ${executor}\n` +
            `> 📁 **Categoría anterior:** ${channel.parentId ? `<#${channel.parentId}>` : "Ninguna (Raíz del servidor)"}`,
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `⏱️ **Fecha de eliminación:** <t:${Math.floor(Date.now() / 1000)}:F> (<t:${Math.floor(Date.now() / 1000)}:R>)`,
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
