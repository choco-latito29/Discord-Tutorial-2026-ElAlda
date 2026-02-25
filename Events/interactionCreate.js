const {
  Events,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} = require("discord.js");
require("colors");

module.exports = {
  name: Events.InteractionCreate,
  on: true,
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      const container = new ContainerBuilder()
        .setAccentColor(0xff0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `El comando \`\`${interaction.commandName}\`\` no existe o ha sido eliminado...`,
          ),
        );

      await interaction.reply({
        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        components: [container],
        allowedMentions: { repliedUser: false },
      });
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(
        `❌ Error al ejecutar el comando \`\`${interaction.commandName}\`\`: ${error.message}`,
      );

      if (interaction.replied || interaction.deferred) {
        const container = new ContainerBuilder()
          .setAccentColor(0xff0000)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `Ocurrió un error al ejecutar el comando \`\`${interaction.commandName}\`\`. Por favor, inténtalo de nuevo más tarde.`,
            ),
          );

        await interaction.followUp({
          flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
          components: [container],
          allowedMentions: { repliedUser: false },
        });
      } else {
        const container = new ContainerBuilder()
          .setAccentColor(0xff0000)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `Ocurrió un error al ejecutar el comando \`\`${interaction.commandName}\`\`. Por favor, inténtalo de nuevo más tarde.`,
            ),
          );

        await interaction.reply({
          flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
          components: [container],
          allowedMentions: { repliedUser: false },
        });
      }
    }
  },
};
