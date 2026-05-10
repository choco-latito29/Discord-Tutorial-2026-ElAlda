const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the music and disconnect from the voice channel.")
    .setContexts(0)
    .setIntegrationTypes(0),

  async execute(interaction, client) {
    const player = client.manager.players.get(interaction.guildId);

    if (!player) {
      const container = new ContainerBuilder()
        .setAccentColor(0xed4245)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("❌ There is nothing playing right now.")
        );
      return interaction.reply({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] });
    }

    if (!interaction.member.voice.channel || interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      const container = new ContainerBuilder()
        .setAccentColor(0xed4245)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("❌ You must be in the same voice channel as me.")
        );
      return interaction.reply({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] });
    }

    player.destroy();

    const container = new ContainerBuilder()
      .setAccentColor(0x57f287)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("⏹️ Music stopped and disconnected.")
      );

    return interaction.reply({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] });
  },
};