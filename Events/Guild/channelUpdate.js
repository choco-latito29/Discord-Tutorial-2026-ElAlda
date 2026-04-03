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
   * @param {import("discord.js").Channel} oldChannel
   * @param {import("discord.js").Channel} newChannel
   * @param {import("discord.js").Client} client
   */
  async execute(oldChannel, newChannel, client) {
    if (!oldChannel.guild) return;

    const config = getData("logs", oldChannel.guild.id);
    if (!config || !config.logChannelId) return;

    const logChannel = oldChannel.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return;

    const fetchLogs = await oldChannel.guild
      .fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelUpdate })
      .catch(() => null);

    const logEntry = fetchLogs ? fetchLogs.entries.first() : null;
    const executor = logEntry ? logEntry.executor : "Desconocido";

    const container = new ContainerBuilder()
      .setAccentColor(0xf39c12)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ✏️ Canal Actualizado"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Se ha detectado una modificación en el canal <#${newChannel.id}>.\n\n` +
            `**🛠️ Detalles del evento:**\n` +
            `> 🧑‍💻 **Editado por:** ${executor}\n` +
            `> 🆔 **ID del Canal:** \`${newChannel.id}\``,
        ),
      );

    let hasChanges = false;

    if (oldChannel.name !== newChannel.name) {
      hasChanges = true;
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**🏷️ Cambio de Nombre:**\n` +
            `> 🔴 **Antes:** ${oldChannel.name}\n` +
            `> 🟢 **Después:** ${newChannel.name}`,
        ),
      );
    }

    if (oldChannel.topic !== newChannel.topic) {
      hasChanges = true;
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**📝 Cambio de Tema/Descripción:**\n` +
            `> 🔴 **Antes:** ${oldChannel.topic || "*[Sin descripción]*"}\n` +
            `> 🟢 **Después:** ${newChannel.topic || "*[Sin descripción]*"}`,
        ),
      );
    }

    if (oldChannel.parentId !== newChannel.parentId) {
      hasChanges = true;
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**📁 Cambio de Categoría:**\n` +
            `> 🔴 **Antes:** ${oldChannel.parentId ? `<#${oldChannel.parentId}>` : "*[Ninguna]*"}\n` +
            `> 🟢 **Después:** ${newChannel.parentId ? `<#${newChannel.parentId}>` : "*[Ninguna]*"}`,
        ),
      );
    }

    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
      hasChanges = true;
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**⏳ Cambio de Modo Lento:**\n` +
            `> 🔴 **Antes:** ${oldChannel.rateLimitPerUser ? oldChannel.rateLimitPerUser + " segundos" : "Desactivado"}\n` +
            `> 🟢 **Después:** ${newChannel.rateLimitPerUser ? newChannel.rateLimitPerUser + " segundos" : "Desactivado"}`,
        ),
      );
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      hasChanges = true;
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**🔞 Restricción de Edad (NSFW):**\n` +
            `> 🔴 **Antes:** ${oldChannel.nsfw ? "Activado ✅" : "Desactivado ❌"}\n` +
            `> 🟢 **Después:** ${newChannel.nsfw ? "Activado ✅" : "Desactivado ❌"}`,
        ),
      );
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
        flags: MessageFlags.IsComponentsV2,
        components: [container],
        allowedMentions: { repliedUser: false },
      })
      .catch(() => null);
  },
};
