const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song or add it to the queue.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Song name or URL.")
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

    if (
      interaction.guild.members.me.voice.channel &&
      interaction.guild.members.me.voice.channelId !== voiceChannel.id
    ) {
      const container = new ContainerBuilder()
        .setAccentColor(0xed4245)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("❌ I'm already in a different voice channel.")
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

    let player = client.manager.players.get(interaction.guildId);

    if (!player) {
      player = client.manager.players.create({
        guildId: interaction.guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channelId,
        autoPlay: true,
        selfDeaf: true,
        volume: 100,
      });
      await player.connect();
    }

    const isPlaylist = result.loadType === "playlist";
    const tracks = isPlaylist ? result.tracks : [result.tracks[0]];

    for (const track of tracks) {
      player.queue.add(track);
    }

    if (!player.playing && !player.paused) {
      await player.play();
    }

    const description = isPlaylist
      ? `✅ Added **${tracks.length}** tracks from **${result.playlistInfo.name}** to the queue.`
      : `✅ Added **[${tracks[0].title}](${tracks[0].uri})** to the queue.`;

    const container = new ContainerBuilder()
      .setAccentColor(0x57f287)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(description)
      );

    return interaction.editReply({ flags: MessageFlags.IsComponentsV2, components: [container] });
  },
};