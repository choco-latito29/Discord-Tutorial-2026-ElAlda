const {
  AuditLogEvent,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "roleDelete",
  on: true,
  /**
   *
   * @param {import("discord.js").Role} role
   * @param {import("discord.js").Client} client
   */
  async execute(role, client) {
    if (!role.guild) return;

    const config = getData("logs", role.guild.id);

    if (!config || !config.logChannelId) return;

    const logChannel = role.guild.channels.cache.get(config.logChannelId);

    if (!logChannel) return;

    const fetchLogs = await role.guild
      .fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete })
      .catch(() => null);

    const logEntry = fetchLogs ? fetchLogs.entries.first() : null;
    const executor = logEntry ? logEntry.executor : "Desconocido";

    const container = new ContainerBuilder()
      .setAccentColor(role.color || 0xe74c3c)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ❌ Rol Eliminado"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Se ha eliminado un rol del servidor de forma permanente. Aquí están los últimos datos conocidos:\n\n` +
            `**📄 Información del Rol Eliminado:**\n` +
            `> 🏷️ **Nombre:** ${role.name}\n` +
            `> 🆔 **ID:** \`${role.id}\`\n\n` +
            `**🛠️ Detalles de la Acción:**\n\n` +
            `> 🗑️ **Eliminado por:** ${executor}\n` +
            `> 🎨 **Color (Hex) que tenía:** \`${role.hexColor || "#000000"}\``,
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
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        components: [container],
        allowedMentions: { repliedUser: false },
      })
      .catch(() => null);
  },
};
