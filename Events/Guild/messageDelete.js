const {
  AuditLogEvent,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
} = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "messageDelete",
  on: true,
  /**
   *
   * @param {import("discord.js").Message} message
   * @param {import("discord.js").Client} client
   */
  async execute(message, client) {
    if (!message.guild) return;
    if (message.partial) await message.fetch().catch(() => null);
    if (message.author?.bot) return;

    const config = getData("logs", message.guild.id);
    if (!config || !config.logChannelId) return;

    const logChannel = message.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return;

    const fetchLogs = await message.guild
      .fetchAuditLogs({ limit: 1, type: AuditLogEvent.MessageDelete })
      .catch(() => null);

    const logEntry = fetchLogs ? fetchLogs.entries.first() : null;

    let executor = `<@${message.author?.id || "Desconocido"}> (El mismo autor)`;

    if (logEntry) {
      const tiempo = Date.now() - logEntry.createdTimestamp;

      if (tiempo < 5000 && logEntry.target.id === message.author?.id) {
        executor = `<@${logEntry.executor.id}> (Moderador)`;
      }
    }

    const hasText = message.content && message.content.trim().length > 0;
    const hasAttachments = message.attachments.size > 0;

    let detallesMensaje =
      `Se ha eliminado un mensaje en el servidor.\n\n` +
      `**📄 Detalles del Mensaje:**\n` +
      `> 👤 **Autor:** <@${message.author?.id || "Desconocido"}>\n` +
      `> 💬 **Canal:** <#${message.channel.id}>\n` +
      `> 🕵️ **Eliminado por:** ${executor}\n`;

    if (hasText) {
      detallesMensaje += `\n**📝 Contenido del texto:**\n> ${message.content}\n`;
    }

    if (hasAttachments) {
      const attachmentsText = message.attachments
        .map((a) => `[Enlace al Archivo](${a.url})`)
        .join("\n> 🔗 ");

      detallesMensaje += `\n**📎 Archivos / Enlaces:**\n> 🔗 ${attachmentsText}\n`;
    }

    const imagenes = message.attachments.filter((a) =>
      a.contentType?.startsWith("image"),
    );

    const container = new ContainerBuilder()
      .setAccentColor(0xe74c3c)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## 🗑️ Mensaje Eliminado"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(detallesMensaje.trim()),
      );

    if (imagenes.size > 0) {
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true));

      const gallery = new MediaGalleryBuilder();

      imagenes.forEach((img) => {
        gallery.addItems(new MediaGalleryItemBuilder().setURL(img.url));
      });

      container.addMediaGalleryComponents(gallery);
    }

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
