const {
  AuditLogEvent,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
  PermissionsBitField,
} = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "roleUpdate",
  on: true,
  /**
   *
   * @param {import("discord.js").Role} oldRole
   * @param {import("discord.js").Role} newRole
   * @param {import("discord.js").Client} client
   */
  async execute(oldRole, newRole, client) {
    const cooldown = new Map();

    if (!newRole.guild) return;

    const key = `${oldRole.guild.id}-${oldRole.id}`;

    if (cooldown.has(key)) return;
    cooldown.set(key, true);
    setTimeout(() => cooldown.delete(key), 1000);

    const config = getData("logs", oldRole.guild.id);

    if (!config || !config.logChannelId) return;

    const logChannel = oldRole.guild.channels.cache.get(config.logChannelId);

    if (!logChannel) return;

    await new Promise((r) => setTimeout(r, 1000));

    const fetchLogs = await oldRole.guild
      .fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleUpdate })
      .catch(() => null);

    const logEntry = fetchLogs ? fetchLogs.entries.first() : null;
    const executor = logEntry ? logEntry.executor : "Desconocido";

    const container = new ContainerBuilder()
      .setAccentColor(newRole.color || 0xf39c12)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ✏️ Rol Actualizado"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Se ha detectado una modificación en el rol **${oldRole.name}** (<@&${newRole.id}>).\n\n` +
            `**🛠️ Detalles del evento:**\n` +
            `> **Editado por:** ${executor}\n` +
            `> **ID del Rol:** \`${newRole.id}\``,
        ),
      );

    let hasChanges = false;

    if (oldRole.name !== newRole.name) {
      hasChanges = true;
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**📌 Cambio de Nombre:**\n` +
            `> 🔴 **Antes:** ${oldRole.name}\n` +
            `> 🟢 **Después:** ${newRole.name}`,
        ),
      );
    }

    if (oldRole.color !== newRole.color) {
      hasChanges = true;
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**🎨 Cambio de Color (Hex):**\n` +
            `> 🔴 **Antes:** \`${oldRole.hexColor || "#000000"}\`\n` +
            `> 🟢 **Después:** \`${newRole.hexColor || "#000000"}\``,
        ),
      );
    }

    if (oldRole.position !== newRole.position) {
      hasChanges = true;
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**📊 Cambio de Posición:**\n` +
            `> 🔴 **Antes:** \`${oldRole.position}\`\n` +
            `> 🟢 **Después:** \`${newRole.position}\``,
        ),
      );
    }

    if (oldRole.hoist !== newRole.hoist) {
      hasChanges = true;
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**🗂️ Cambio de Separación (Hoist):**\n` +
            `> 🔴 **Antes:** ${oldRole.hoist ? "Sí ✅" : "No ❌"}\n` +
            `> 🟢 **Después:** ${newRole.hoist ? "Sí ✅" : "No ❌"}`,
        ),
      );
    }

    if (oldRole.mentionable !== newRole.mentionable) {
      hasChanges = true;
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**📣 Cambio de Mencionable:**\n` +
            `> 🔴 **Antes:** ${oldRole.mentionable ? "Sí ✅" : "No ❌"}\n` +
            `> 🟢 **Después:** ${newRole.mentionable ? "Sí ✅" : "No ❌"}`,
        ),
      );
    }

    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      hasChanges = true;
      const oldp = oldRole.permissions.toArray();
      const newp = newRole.permissions.toArray();

      const added = newp.filter((p) => !oldp.includes(p));
      const removed = oldp.filter((p) => !newp.includes(p));

      if (added.length > 0) {
        container.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `**✅ Permisos Añadidos:**\n` +
              added.map((p) => `> 🟢 \`${p}\``).join("\n"),
          ),
        );
      }

      if (removed.length > 0) {
        container.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `**❌ Permisos Eliminados:**\n` +
              removed.map((p) => `> 🔴 \`${p}\``).join("\n"),
          ),
        );
      }
    }

    if (!hasChanges) return;

    container
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `⏱️ **Fecha:** <t:${Math.floor(Date.now() / 1000)}:F> (<t:${Math.floor(Date.now() / 1000)}:R>)`,
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
