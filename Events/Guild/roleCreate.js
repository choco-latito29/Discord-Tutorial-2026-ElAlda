const {
  AuditLogEvent,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "roleCreate",
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
      .fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleCreate })
      .catch(() => null);

    const logEntry = fetchLogs ? fetchLogs.entries.first() : null;
    const executor = logEntry ? logEntry.executor : "Desconocido";

    const container = new ContainerBuilder()
      .setAccentColor(role.color || 0x2ecc71)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ✅ Nuevo Rol Creado"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Se ha detectado la creación de un nuevo rol en el servidor. Aquí tienes los detalles:\n\n` +
            `**📄 Información General:**\n` +
            `> 🏷️ **Nombre:** ${role.name}\n` +
            `> 📢 **Mención:** <@&${role.id}>\n` +
            `> 🆔 **ID:** \`${role.id}\`\n\n` +
            `**🛠️ Ajustes y Propiedades:**\n\n` +
            `> 🧑‍💻 **Creado por:** ${executor}\n` +
            `> 🎨 **Color (Hex):** \`${role.hexColor}\`\n` +
            `> 📊 **Posición:** \`${role.position}\`\n` +
            `> 🗂️ **Separado (Hoist):** ${role.hoist ? "Sí ✅" : "No ❌"}\n` +
            `> 📣 **Mencionable:** ${role.mentionable ? "Sí ✅" : "No ❌"}`,
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `⏱️ **Fecha:** <t:${Math.floor(role.createdTimestamp / 1000)}:F> (<t:${Math.floor(role.createdTimestamp / 1000)}:R>)`,
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
