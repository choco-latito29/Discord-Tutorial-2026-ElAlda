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
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    const { commandName, user } = interaction;

    const developers = process.env.DEVELOPERS_ID
      ? process.env.DEVELOPERS_ID.split(",").map((id) => id.trim())
      : [];

    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(commandName);

      if (!command) {
        const container = new ContainerBuilder()
          .setAccentColor(0xff0000)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `The command \`\`${commandName}\`\` does not exist or has been deleted...`,
            ),
          );

        await interaction.reply({
          flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
          components: [container],
          allowedMentions: { repliedUser: false },
        });
      }

      if (command.developer && !developers.includes(user.id)) {
        const container = new ContainerBuilder()
          .setAccentColor(0xed4245)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              "🔒 **Restricted Access**\n" +
                "You do not have the developer permissions required to execute this command.",
            ),
          );

        await interaction.reply({
          flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
          components: [container],
          allowedMentions: { repliedUser: false },
        });

        return;
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(
          `❌ Error executing command \`\`${interaction.commandName}\`\`: ${error.message}`,
        );

        if (interaction.replied || interaction.deferred) {
          const container = new ContainerBuilder()
            .setAccentColor(0xff0000)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `An error occurred while executing the command \`\`${interaction.commandName}\`\`. Please try again later.`,
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
                `An error occurred while executing the command \`\`${interaction.commandName}\`\`. Please try again later.`,
              ),
            );

          await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [container],
            allowedMentions: { repliedUser: false },
          });
        }
      }
    } else if (interaction.isAutocomplete()) {
      const command = client.slashCommands.get(interaction.commandName);

      if (command && command.autocomplete) {
        await command.autocomplete(interaction);
      } else {
        await interaction.respond([]);
      }
    } else {
      return;
    }
  },
};
