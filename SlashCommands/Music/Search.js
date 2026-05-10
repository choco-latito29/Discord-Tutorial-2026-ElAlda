const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search for a song and pick one from the results.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Song name to search.")
        .setRequired(true)
    )
    .setContexts(0)
    .setIntegrationTypes(0),

  async execute(interaction, client) {
    if (!interaction.guild) return;

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      const container = new ContainerBuilder()
        .setAccentColor(0xed4245)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("❌ You must be in a voice channel to use this command.")
        );
      return interaction.editReply({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }

    const result = await client.manager.search({ query, requester: interaction.user }).catch(() => null);

    if (!result || !result.tracks || result.tracks.length === 0) {
      const container = new ContainerBuilder()
        .setAccentColor(0xed4245)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("❌ No results found for that query.")
        );
      return interaction.editReply({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }

    const tracks = result.tracks.slice(0, 5);
    const list = tracks.map((t, i) => `**${i + 1}.** [${t.title}](${t.uri}) — \`${t.author}\``).join("\n");

    const container = new ContainerBuilder()
      .setAccentColor(0x5865f2)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`🔎 **Search results for:** \`${query}\`\n\n${list}`)
      );

    const buttons = new ActionRowBuilder().addComponents(
      tracks.map((_, i) =>
        new ButtonBuilder()
          .setCustomId(`search_pick_${i}_${interaction.id}`)
          .setLabel(`${i + 1}`)
          .setStyle(ButtonStyle.Primary)
      )
    );

    await interaction.editReply({
      flags: MessageFlags.IsComponentsV2,
      components: [container, buttons],
    });

    const filter = (i) =>
      i.customId.endsWith(`_${interaction.id}`) &&
      i.user.id === interaction.user.id;

    const collected = await interaction.channel
      .awaitMessageComponent({ filter, time: 30000 })
      .catch(() => null);

    if (!collected) {
      const expired = new ContainerBuilder()
        .setAccentColor(0xed4245)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("⏱️ Search timed out.")
        );
      return interaction.editReply({ flags: MessageFlags.IsComponentsV2, components: [expired] });
    }

    const index = parseInt(collected.customId.split("_")[2]);
    const selected = tracks[index];

    let player = client.manager.players.get(interaction.guildId);

    if (!player) {
      player = client.manager.players.create({
        guildId: interaction.guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channelId,
        autoPlay: false,
        selfDeaf: true,
        volume: 100,
      });
      await player.connect();
    }

    player.queue.add(selected);

    if (!player.playing && !player.paused) {
      await player.play();
    }

    const done = new ContainerBuilder()
      .setAccentColor(0x57f287)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`✅ Added **[${selected.title}](${selected.uri})** to the queue.`)
      );

    await collected.update({ flags: MessageFlags.IsComponentsV2, components: [done] });
  },
};