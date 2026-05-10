const { ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags, MediaGalleryBuilder, MediaGalleryItemBuilder } = require("discord.js");
const MusicCard = require("../../Utils/Musiccard");

module.exports = (client) => {
  if (!client.manager) return;

  client.manager.on("trackStart", async (player, track) => {
    try {
      const channel = client.channels.cache.get(player.textChannelId);
      if (!channel) return;

      const { container, attachment } = await createContainer(player, track);

      if (player.nowPlayingMessage) {
        try {
          await player.nowPlayingMessage.edit({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
            files: [attachment],
          });
          return;
        } catch (_) {}
      }

      const message = await channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
        files: [attachment],
      }).catch(() => null);

      if (message) player.nowPlayingMessage = message;
    } catch (error) {
      console.error("[MUSIC] Error in trackStart:", error);
    }
  });

  client.manager.on("queueEnd", async (player) => {
    try {
      if (player.nowPlayingMessage) {
        await disableAllButtons(player.nowPlayingMessage);
      }

      const channel = client.channels.cache.get(player.textChannelId);
      if (channel) {
        const container = new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent("✅ Queue finished. Leaving voice channel...")
        );
        await channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      }

      player.destroy();
    } catch (error) {
      console.error("[MUSIC] Error in queueEnd:", error.message);
    }
  });

  client.manager.on("playerDestroy", async (player) => {
    try {
      if (player.nowPlayingMessage) {
        await disableAllButtons(player.nowPlayingMessage);
      }
    } catch (error) {
      console.error("[MUSIC] Error in playerDestroy:", error.message);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    if (!["music_pause", "music_skip", "music_stop", "music_loop"].includes(interaction.customId)) return;

    const player = client.manager.players.get(interaction.guildId);
    if (!player) return;

    if (!interaction.member.voice.channel || interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.reply({ content: "❌ You must be in the same voice channel as me.", flags: 64 });
    }

    switch (interaction.customId) {
      case "music_pause":
        if (player.paused) {
          player.resume();
          await interaction.reply({ content: "▶️ Music resumed.", flags: 64 });
        } else {
          player.pause();
          await interaction.reply({ content: "⏸️ Music paused.", flags: 64 });
        }
        break;

      case "music_skip": {
        const queueSize = Array.from(player.queue).length;
        if (queueSize === 0) {
          return interaction.reply({ content: "❌ There are no more songs in the queue to skip to.", flags: 64 });
        }
        player.skip();
        await interaction.reply({ content: "⏭️ Song skipped.", flags: 64 });
        break;
      }

      case "music_stop":
        if (player.nowPlayingMessage) await disableAllButtons(player.nowPlayingMessage);
        player.destroy();
        await interaction.reply({ content: "⏹️ Music stopped and disconnected.", flags: 64 });
        break;

      case "music_loop":
        if (player.loop === "none") {
          player.setLoop("track");
          await interaction.reply({ content: "🔂 Track loop enabled.", flags: 64 });
        } else if (player.loop === "track") {
          player.setLoop("queue");
          await interaction.reply({ content: "🔁 Queue loop enabled.", flags: 64 });
        } else {
          player.setLoop("none");
          await interaction.reply({ content: "▶️ Loop disabled.", flags: 64 });
        }
        break;
    }
  });
};

async function createContainer(player, track) {
  const musicCard = new MusicCard();
  const buffer = await musicCard.createMusicCard(track, 0);
  const attachment = new AttachmentBuilder(buffer, { name: "musicard.png" });

  const mediaGalleryItem = new MediaGalleryItemBuilder().setURL("attachment://musicard.png");
  const mediaGallery = new MediaGalleryBuilder().addItems(mediaGalleryItem);

  const hasQueue = Array.from(player.queue).length > 0;

  const controlButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("music_stop")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("⏹️"),
    new ButtonBuilder()
      .setCustomId("music_pause")
      .setStyle(ButtonStyle.Success)
      .setEmoji("⏸️"),
    new ButtonBuilder()
      .setCustomId("music_skip")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("⏭️")
      .setDisabled(!hasQueue),
    new ButtonBuilder()
      .setCustomId("music_loop")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("🔁")
  );

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("**Now Playing...**")
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`> [${track.title}](${track.uri})`)
    )
    .addMediaGalleryComponents(mediaGallery)
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
    )
    .addActionRowComponents(controlButtons);

  return { container, attachment };
}

async function disableAllButtons(message) {
  try {
    const controlButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("music_stop").setStyle(ButtonStyle.Danger).setEmoji("⏹️").setDisabled(true),
      new ButtonBuilder().setCustomId("music_pause").setStyle(ButtonStyle.Secondary).setEmoji("⏸️").setDisabled(true),
      new ButtonBuilder().setCustomId("music_skip").setStyle(ButtonStyle.Secondary).setEmoji("⏭️").setDisabled(true),
      new ButtonBuilder().setCustomId("music_loop").setStyle(ButtonStyle.Primary).setEmoji("🔁").setDisabled(true)
    );

    const updatedContainer = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("**Session Ended**")
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
      )
      .addActionRowComponents(controlButtons);

    await message.edit({ components: [updatedContainer], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  } catch (error) {
    console.error("[MUSIC] Error disabling buttons:", error.message);
  }
}