const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SectionBuilder,
  ThumbnailBuilder,
} = require("discord.js");
const { getData, setData } = require("../../Events/Client/dbManager");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("🚫 Manage and restrict users from using the bot.")
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("➕ Ban a user from accessing bot commands globally.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("👤 Select the user to be restricted.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("📝 Provide a detailed reason for the restriction.")
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(200),
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("⏳ Select how long the restriction will last.")
            .addChoices(
              { name: "⏲️ 1 Minute (Test)", value: "1min" },
              { name: "🕓 1 Hour", value: "1h" },
              { name: "📅 1 Day", value: "1d" },
              { name: "🗓️ 1 Week", value: "1w" },
              { name: "🧱 1 Month", value: "1mo" },
              { name: "🛡️ Permanent", value: "perm" },
            )
            .setRequired(true),
        )
        .addAttachmentOption((option) =>
          option
            .setName("evidence")
            .setDescription("📸 Upload proof or screenshots of the offense.")
            .setRequired(false),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("view")
        .setDescription("🔍 Check the current restriction status of a user.")
        .addStringOption((option) =>
          option
            .setName("user")
            .setDescription("🆔 Provide the User ID or mention to audit.")
            .setAutocomplete(true)
            .setRequired(false),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("remove")
        .setDescription(
          "🔓 Restore access: Lift the global restriction from a user.",
        )
        .addStringOption((option) =>
          option
            .setName("user")
            .setDescription("🆔 Provide the User ID or mention to unban.")
            .setAutocomplete(true)
            .setRequired(true),
        ),
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    const { options, guild, user } = interaction;

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const CLAVE = "blacklist";
    const sub = options.getSubcommand();

    const channel = await client.channels
      .fetch(process.env.CHANNEL_LOGS_ID)
      .catch(() => null);

    const rawData = getData("blacklist", CLAVE) || {};
    const blacklistData = rawData.usuarios || {};

    switch (sub) {
      case "add": {
        const target = options.getUser("target");
        const reason = options.getString("reason");
        const duration = options.getString("duration");
        const evidence = options.getAttachment("evidence");

        if (target.id === user.id) {
          const autoError = new ContainerBuilder()
            .setAccentColor(0xff0000)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "⚠️ **System Protection:** You cannot put yourself on the blacklist.",
              ),
            );

          await interaction.editReply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [autoError],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        if (target.bot) {
          const botError = new ContainerBuilder()
            .setAccentColor(0xff0000)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                target.id === client.user.id
                  ? "🚫 **Fatal Error:** I cannot blacklist myself."
                  : `⚠️ **System Protection:** **${target.tag}** is a bot.`,
              ),
            );

          await interaction.editReply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [botError],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        if (target.id === guild.ownerId) {
          const ownerError = new ContainerBuilder()
            .setAccentColor(0xff0000)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `❌ **Permission Denied:** You cannot blacklist the Server Owner (**${target.tag}**).`,
              ),
            );

          await interaction.editReply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [ownerError],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        const timestamps = await getTimestamp();
        const durationData = timestamps[duration];

        if (!durationData) {
          const errorTime = new ContainerBuilder()
            .setAccentColor(0xff0000)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `❌ **Configuration Error:** The duration \`${duration}\` is not valid in the Factory.`,
              ),
            );

          await interaction.editReply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [errorTime],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        const now = Date.now();

        const expiresAt = durationData.ms ? now + durationData.ms : null;

        const textExpiresAt = expiresAt
          ? `<t:${Math.floor(expiresAt / 1000)}:R>`
          : "🛡️ **Permanent**";

        const fullTime = expiresAt
          ? `<t:${Math.floor(expiresAt / 1000)}:f>`
          : "**Never**";

        if (blacklistData[target.id]) {
          const userData = blacklistData[target.id];

          const textExpiresAtPrev = userData.expiresAt
            ? `<t:${Math.floor(userData.expiresAt / 1000)}:f> (<t:${Math.floor(userData.expiresAt / 1000)}:R>)`
            : "🛡️ **Permanent Restriction**";

          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(
                    `## ⚠️ Existing Restriction Detected`,
                  ),
                )
                .setThumbnailAccessory(
                  new ThumbnailBuilder().setURL(
                    target.displayAvatarURL({ forceStatic: false, size: 1024 }),
                  ),
                ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `## ⚠️ Duplicate Restriction\n` +
                  `The user **${target.tag}** (\`${target.id}\`) is already registered.\n\n` +
                  `**Reason:** ${userData.reason}\n` +
                  `**Status:** ${textExpiresAtPrev}\n` +
                  `**Moderator:** <@${userData.moderator}>`,
              ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true));

          const responseFiles = [];

          if (userData.evidence) {
            const ext =
              userData.evidence.split(".").pop().split(/\#|\?/)[0] || "png";

            const fn = `evidence_${target.id}.${ext}`;

            responseFiles.push({
              attachment: userData.evidence,
              name: fn,
            });

            container.addMediaGalleryComponents(
              new MediaGalleryBuilder().addItems(
                new MediaGalleryItemBuilder().setURL(`attachment://${fn}`),
              ),
            );
          }

          await interaction.editReply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [container],
            files: responseFiles,
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        if (evidence) {
          const validMimes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
            "video/mp4",
            "video/quicktime",
            "video/webm",
          ];

          const fileName = evidence.name.toLowerCase();

          const isValidExtension = [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".mp4",
            ".webm",
            ".mov",
          ].some((ext) => fileName.endsWith(ext));

          if (!validMimes.includes(evidence.contentType) && !isValidExtension) {
            const invalidFile = new ContainerBuilder()
              .setAccentColor(0xed4245)
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  `❌ Unsupported Format\n` +
                    `Only PNG, JPG, GIF, MP4 and WEBM are allowed.`,
                ),
              );

            await interaction.editReply({
              flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
              components: [invalidFile],
              allowedMentions: { repliedUser: false },
            });

            return;
          }
        }

        const evidenceUrl = evidence ? evidence.url : null;

        blacklistData[target.id] = {
          reason,
          evidence: evidenceUrl,
          expiresAt,
          durationLabel: durationData.label,
          moderator: user.id,
          addedAt: now,
        };

        setData("blacklist", CLAVE, {
          usuarios: blacklistData,
        });

        try {
          const dmContainer = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(
                    `## 🔒 Access Restricted`,
                  ),
                )
                .setThumbnailAccessory(
                  new ThumbnailBuilder().setURL(
                    target.displayAvatarURL({ forceStatic: false, size: 1024 }),
                  ),
                ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `**Reason:** ${reason}\n` +
                  `**Status:** ${textExpiresAt}\n` +
                  `**Expiration:** ${fullTime}\n` +
                  `**Moderator:** <@${user.id}>`,
              ),
            );

          const dmFiles = [];

          if (evidence) {
            const ext =
              evidence.url.split(".").pop().split(/\#|\?/)[0] || "png";

            const fn = `evidence_${target.id}.${ext}`;

            dmFiles.push({
              attachment: evidence.url,
              name: fn,
            });

            dmContainer.addMediaGalleryComponents(
              new MediaGalleryBuilder().addItems(
                new MediaGalleryItemBuilder().setURL(`attachment://${fn}`),
              ),
            );
          }

          await target.send({
            flags: MessageFlags.IsComponentsV2,
            components: [dmContainer],
            files: dmFiles,
          });
        } catch (e) {
          null;
        }

        if (channel) {
          const shared = client.guilds.cache.filter((g) =>
            g.members.cache.has(target.id),
          ).size;

          const logContainer = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(
                    `## 🚫 Global Restriction Log`,
                  ),
                )
                .setThumbnailAccessory(
                  new ThumbnailBuilder().setURL(
                    target.displayAvatarURL({ forceStatic: false, size: 1024 }),
                  ),
                ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `**User:** <@${target.id}> (\`${target.id}\`)\n` +
                  `**Created:** <t:${Math.floor(target.createdTimestamp / 1000)}:R>\n` +
                  `**Servers:** \`${shared}\` shared\n\n` +
                  `**Reason:** ${reason}\n` +
                  `**Expires:** ${fullTime} (${textExpiresAt})\n` +
                  `**Staff:** <@${user.id}>`,
              ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true));

          const logFiles = [];

          if (evidence) {
            const ext =
              evidence.url.split(".").pop().split(/\#|\?/)[0] || "png";

            const fn = `audit_${target.id}.${ext}`;

            logFiles.push({
              attachment: evidence.url,
              name: fn,
            });

            logContainer.addMediaGalleryComponents(
              new MediaGalleryBuilder().addItems(
                new MediaGalleryItemBuilder().setURL(`attachment://${fn}`),
              ),
            );
          }

          await channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [logContainer],
            files: logFiles,
            allowedMentions: { repliedUser: false },
          });
        }

        const success = new ContainerBuilder()
          .setAccentColor(0x57f287)
          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  `## ✅ Global Restriction Applied`,
                ),
              )
              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(
                  target.displayAvatarURL({ forceStatic: false, size: 1024 }),
                ),
              ),
          )
          .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `**User:**  <@${target.id}>  (\`${target.id}\`)\n` +
                `**Created:** <t:${Math.floor(target.createdTimestamp / 1000)}:R>\n` +
                `**Reason:** ${reason}\n` +
                `**Expires:** ${fullTime} (${textExpiresAt})\n` +
                `**Staff:** <@${user.id}>`,
            ),
          )
          .addSeparatorComponents(new SeparatorBuilder().setDivider(true));

        const successFiles = [];

        if (evidence) {
          const ext = evidence.url.split(".").pop().split(/\#|\?/)[0] || "png";

          const fn = `success_${target.id}.${ext}`;

          successFiles.push({
            attachment: evidence.url,
            name: fn,
          });

          success.addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(
              new MediaGalleryItemBuilder().setURL(`attachment://${fn}`),
            ),
          );
        }

        await interaction.editReply({
          flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
          components: [success],
          files: successFiles,
          allowedMentions: { repliedUser: false },
        });

        break;
      }
    }
  },
};

async function getTimestamp() {
  return {
    "1min": { label: "1 Minute (test)", ms: 1000 * 60 },
    "1h": { label: "1 Hour", ms: 1000 * 60 * 60 },
    "1d": { label: "1 Day", ms: 1000 * 60 * 60 * 24 },
    "1w": { label: "1 Week", ms: 1000 * 60 * 60 * 24 * 7 },
    "1mo": { label: "1 Month", ms: 1000 * 60 * 60 * 24 * 30 },
    perm: { label: "Permanent", ms: null },
  };
}
