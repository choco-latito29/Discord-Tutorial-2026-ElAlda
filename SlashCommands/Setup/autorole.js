const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
  PermissionsBitField,
  SeparatorBuilder,
} = require("discord.js");
const { setData, getData } = require("../../Events/Client/dbManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("⚙️ Configure the automatic role assignment system.")
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("➕ Add a role to the system.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("📌 User category.")
            .setRequired(true)
            .addChoices(
              { name: "👤 Usuarios", value: "user" },
              { name: "🤖 Bots", value: "bot" },
            ),
        )
        .addRoleOption((option) =>
          option
            .setName("rol")
            .setDescription("😐 Role to be assigned.")
            .setRequired(true),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("view")
        .setDescription("📋 View current role configurations.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("📌 Filter by category.")
            .setRequired(false)
            .addChoices(
              { name: "👤 Usuarios", value: "user" },
              { name: "🤖 Bots", value: "bot" },
            ),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("delete")
        .setDescription("🗑️ Remove a role from the system.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("📌 User category.")
            .setRequired(false)
            .addChoices(
              { name: "👤 Usuarios", value: "user" },
              { name: "🤖 Bots", value: "bot" },
            ),
        )
        .addStringOption((option) =>
          option
            .setName("role")
            .setDescription("📌 Select the role to delete.")
            .setRequired(false)
            .setAutocomplete(true),
        ),
    )
    .setContexts(0)
    .setIntegrationTypes(0),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    const { options, guild, member, user } = interaction;

    const sub = options.getSubcommand();
    const type = options.getString("type");
    const roleObj = options.getRole("rol");
    const roleId = options.getString("role");

    let data = getData("autorole", guild.id) || {
      usuarios: [],
      bots: [],
    };

    const targetArray = type === "user" ? data.usuarios : data.bots;

    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      const container = new ContainerBuilder()
        .setAccentColor(0xff0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "⚠️ **Permission Denied:** This command is restricted to Server Administrators only.",
          ),
        );

      await interaction.reply({
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        components: [container],
        allowedMentions: { repliedUser: false },
      });

      return;
    }

    switch (sub) {
      case "add":
        if (roleObj.id === guild.id) {
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Action Denied"),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "You cannot configure the default `@everyone` role in the auto-role system.",
              ),
            );

          await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [container],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        if (
          roleObj.position >=
          interaction.guild.members.me.roles.highest.position
        ) {
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Hierarchy Error"),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `I cannot manage the role ${roleObj} because it is higher than (or equal to) my highest role.\n\n` +
                  `💡 *Solution: Go to Server Settings and drag my role above the role you are trying to configure.*`,
              ),
            );

          await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [container],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        if (
          roleObj.position >= member.roles.highest.position &&
          user.id !== guild.ownerId
        ) {
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "## ❌ Insufficient Permissions",
              ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `You cannot configure the role ${roleObj} because it is higher than or equal to your highest role.`,
              ),
            );

          await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [container],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        if (roleObj.permissions.has(PermissionsBitField.Flags.Administrator)) {
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "## 🛡️ Critical Security Risk",
              ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `You cannot add ${roleObj} to the system because it has **Administrator** permissions.\n\n` +
                  `💡 *Automatically granting admin rights to new members is extremely dangerous for the server safety.*`,
              ),
            );

          await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [container],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        if (targetArray.includes(roleObj.id)) {
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Duplicate Role"),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `The role ${roleObj} is already configured in this auto-role category.\n\n` +
                  `💡 *To remove it, use the </autorole delete:1497787797858291915> subcommand.*`,
              ),
            );

          await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [container],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        targetArray.push(roleObj.id);
        setData("autorole", guild.id, data);

        const successContainer = new ContainerBuilder()
          .setAccentColor(0x57f287)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## ✅ Setup Successful"),
          )
          .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `The role ${roleObj} has been successfully linked to the auto-role system.\n\n` +
                `📌 **Assigned Category:** ${type === "user" ? "👤 Users" : "🤖 Bots"}`,
            ),
          );

        await interaction.reply({
          flags: MessageFlags.IsComponentsV2,
          components: [successContainer],
          allowedMentions: { repliedUser: false },
        });

        break;

      case "view":
        const formatRoles = (roleArray) => {
          if (!roleArray || roleArray.length === 0) {
            return "```\nNo roles configured.\n```";
          }

          return roleArray.map((id) => `> <@&${id}>`).join("\n");
        };

        const usuariosText = formatRoles(data.usuarios);
        const botsText = formatRoles(data.bots);

        const viewContainer = new ContainerBuilder()
          .setAccentColor(0x5865f2)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              "## 📋 Auto-role Configuration",
            ),
          );

        if (type === "user") {
          viewContainer.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `### 👤 Category: Users\n\n` + `${usuariosText}`,
            ),
          );
        } else if (type === "bot") {
          viewContainer.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `### 🤖 Category: Bots\n\n` + `${botsText}`,
            ),
          );
        } else {
          viewContainer
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `### 👤 Category: Users\n\n` + `${usuariosText}`,
              ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `### 🤖 Category: Bots\n\n` + `${botsText}`,
              ),
            );
        }

        await interaction.reply({
          flags: MessageFlags.IsComponentsV2,
          components: [viewContainer],
          allowedMentions: { repliedUser: false },
        });

        break;

      case "delete":
        if (!roleId) {
          const errorContainer = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Missing Data"),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "You must select a specific role to delete from the system.\n\n" +
                  "💡 *Please make sure to click on the options suggested by the autocomplete menu.*",
              ),
            );

          await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [errorContainer],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        let removedCategories = [];

        if (data.usuarios.includes(roleId)) {
          data.usuarios = data.usuarios.filter((id) => id !== roleId);

          removedCategories.push("👤 Users");
        }

        if (data.bots.includes(roleId)) {
          data.bots = data.bots.filter((id) => id !== roleId);
          removedCategories.push("🤖 Bots");
        }

        if (removedCategories.length === 0) {
          const notFoundContainer = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Role Not Found"),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "This role is not currently configured in the auto-role system.",
              ),
            );

          await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [notFoundContainer],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        setData("autorole", guild.id, data);

        const success = new ContainerBuilder()
          .setAccentColor(0x57f287)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## 🗑️ Configuration Removed"),
          )
          .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `The role <@&${roleId}> has been successfully removed.\n\n` +
                `📌 **Removed from:** ${removedCategories.join(" and ")}`,
            ),
          );

        await interaction.reply({
          flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
          components: [success],
          allowedMentions: { repliedUser: false },
        });

        break;

      default:
        break;
    }
  },

  /**
   *
   * @param {import("discord.js").AutocompleteInteraction} interaction
   */
  async autocomplete(interaction) {
    const isAdmin = interaction.member.permissions.has(
      PermissionsBitField.Flags.Administrator,
    );

    if (isAdmin) {
      const focusedValue = interaction.options.getFocused().toLowerCase();
      const type = interaction.options.getString("type");

      let data = getData("autorole", interaction.guild.id) || {
        usuarios: [],
        bots: [],
      };

      let roleIdsToShow = [];

      if (type === "user") {
        roleIdsToShow = data.usuarios;
      } else if (type === "bot") {
        roleIdsToShow = data.bots;
      } else {
        roleIdsToShow = [...data.usuarios, ...data.bots];
      }

      roleIdsToShow = [...new Set(roleIdsToShow)];

      if (roleIdsToShow.length === 0) return await interaction.respond([]);

      const options = roleIdsToShow
        .map((id) => {
          const role = interaction.guild.roles.cache.get(id);
          const name = role ? role.name : `⚠️ Ghost/Deleted Role (${id})`;
          const displayName = `🎭 ${name} (ID: ${id})`;

          return {
            name:
              displayName.length > 100
                ? displayName.substring(0, 97) + "..."
                : displayName,
            value: id,
          };
        })
        .filter((option) => option.name.toLowerCase().includes(focusedValue))
        .slice(0, 25);

      await interaction.respond(options);
    } else {
      await interaction.respond([]);
    }
  },
};
