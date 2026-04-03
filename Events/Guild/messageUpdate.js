const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "messageUpdate",
  on: true,
  /**
   *
   * @param {import("discord.js").Message} oldMessage
   * @param {import("discord.js").Message} newMessage
   * @param {import("discord.js").Client} client
   */
  async execute(oldMessage, newMessage, client) {
    if (!newMessage.guild) return;

    if (oldMessage.partial) await oldMessage.fetch().catch(() => null);
    if (newMessage.partial) await newMessage.fetch().catch(() => null);

    if (newMessage.author?.bot) return;

    if (oldMessage.content === newMessage.content) return;

    const config = getData("logs", newMessage.guild.id);
    if (!config || !config.logChannelId) return;

    const logChannel = newMessage.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return;

    const oldContent =
      oldMessage.content || "*[Mensaje sin texto / Solo archivo]*";
    const newContent =
      newMessage.content || "*[Mensaje sin texto / Solo archivo]*";

    const container = new ContainerBuilder()
      .setAccentColor(0xf1c40f)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ✏️ Mensaje Editado"),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Se ha detectado la edición de un mensaje en el servidor.\n\n` +
            `**📄 Detalles del Mensaje:**\n` +
            `> 👤 **Autor:** <@${newMessage.author?.id || "Desconocido"}>\n` +
            `> 💬 **Canal:** <#${newMessage.channel.id}>\n` +
            `> 🔗 **Enlace:** [Ir al mensaje original](${newMessage.url})\n\n` +
            `**🔴 Antes:**\n` +
            `> ${oldContent}\n\n` +
            `**🟢 Después:**\n` +
            `> ${newContent}`,
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `⏱️ **Fecha de edición:** <t:${Math.floor(Date.now() / 1000)}:F> (<t:${Math.floor(Date.now() / 1000)}:R>)`,
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
