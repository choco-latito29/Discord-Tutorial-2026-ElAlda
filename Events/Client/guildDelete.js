const {
  ContainerBuilder,
  SectionBuilder,
  ThumbnailBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "guildDelete",
  on: true,
  /**
   *
   * @param {import("discord.js").Guild} guild
   * @param {import("discord.js").Client} client
   */
  async execute(guild, client) {
    const ownerId = guild.ownerId || "Desconocido";
    const createdAt = guild.createdTimestamp
      ? `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`
      : "Desconocido";
    const channelCount = guild.channels?.cache?.size || 0;
    const roleCount = guild.roles?.cache?.size || 0;
    const emojiCount = guild.emojis?.cache?.size || 0;
    const boosts = guild.premiumSubscriptionCount || 0;

    const verificationLevels = [
      "Ninguno",
      "Bajo (Correo)",
      "Medio (5 min)",
      "Alto (10 min)",
      "Muy Alto (Teléfono)",
    ];

    const explicitFilters = [
      "Desactivado",
      "Solo roles sin permisos",
      "Todos los miembros",
    ];

    const channel = client.channels.cache.get(
      process.env.CHANNEL_BOT_DELETE_ID,
    );

    if (!channel) return;

    const container = new ContainerBuilder().setAccentColor(0xed4245);

    const mainSection = new SectionBuilder().addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## 🔴 ¡Servidor Perdido!\n` +
          `He sido removido de la comunidad **${guild.name}**.`,
      ),
    );

    const guildIcon = guild.iconURL({ size: 1024, forceStatic: false });

    if (guildIcon) {
      mainSection.setThumbnailAccessory(
        new ThumbnailBuilder().setURL(guildIcon),
      );
    }

    container.addSectionComponents(mainSection);

    container
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `### 📊 Datos Generales\n` +
            `> **ID:** \`${guild.id}\`\n` +
            `> **Propietario:** <@${ownerId}> (\`${ownerId}\`)\n` +
            `> **Creación:** ${createdAt}\n` +
            `> **Población:** ${guild.memberCount || 0} usuarios\n` +
            `> **Estructura:** ${channelCount} canales | ${roleCount} roles\n` +
            `> **Cosméticos:** ${emojiCount} emojis | ${boosts} Boosts\n` +
            (guild.vanityURLCode
              ? `> **Enlace:** \`discord.gg/${guild.vanityURLCode}\`\n`
              : "") +
            (guild.description
              ? `> **Descripción:** *${guild.description}*`
              : ""),
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `### 🛡️ Seguridad del Servidor\n` +
            `> **Verificación:** ${guild.verificationLevel !== undefined ? verificationLevels[guild.verificationLevel] : "Desconocido"}\n` +
            `> **Filtro NSFW:** ${guild.explicitContentFilter !== undefined ? explicitFilters[guild.explicitContentFilter] : "Desconocido"}\n` +
            `> **2FA Moderación:** ${guild.mfaLevel === 1 ? "✅ Requerido" : "❌ No requerido"}\n` +
            `> **Comunidad:** ${guild.features?.includes("COMMUNITY") ? "✅ Activado" : "❌ Desactivado"}`,
        ),
      );

    const guildBanner = guild.bannerURL({ size: 4096, forceStatic: false });

    if (guildBanner) {
      container
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addMediaGalleryComponents(
          new MediaGalleryBuilder().addItems(
            new MediaGalleryItemBuilder().setURL(guildBanner),
          ),
        );
    }

    container
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `🕒 *${new Date().toLocaleString()}*`,
        ),
      );

    await channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
      allowedMentions: { repliedUser: false },
    });
  },
};
