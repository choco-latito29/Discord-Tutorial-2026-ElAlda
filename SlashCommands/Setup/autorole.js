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
    .setDescription("Configurar sistema de autorol.")
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("Añadir rol al sistema.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Tipo de usuario.")
            .setRequired(true)
            .addChoices(
              { name: "👤 Usuarios", value: "user" },
              { name: "🤖 Bots", value: "bot" },
            ),
        )
        .addRoleOption((option) =>
          option
            .setName("rol")
            .setDescription("Rol a añadir.")
            .setRequired(true),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("view")
        .setDescription("Ver configuración de roles")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Tipo de usuario.")
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
        .setDescription("Eliminar un rol configurado")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Tipo de usuario.")
            .setRequired(false)
            .addChoices(
              { name: "👤 Usuarios", value: "user" },
              { name: "🤖 Bots", value: "bot" },
            ),
        )
        .addStringOption((option) =>
          option
            .setName("role")
            .setDescription("Rol a eliminar del sistema.")
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
    const rol = options.getRole("rol");
    const role = options.getString("role");

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
            "⚠️ Este comando solo es uso para los administradores del servidor.",
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
        if (rol.id === guild.id) {
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Acción Denegada"),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "No puedes configurar el rol predeterminado `@everyone` en el sistema de autorol.",
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
          rol.position >= interaction.guild.members.me.roles.highest.position
        ) {
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Error de Jerarquía"),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `No puedo gestionar el rol ${rol} porque está por encima (o al mismo nivel) que mi rol más alto.\n\n` +
                  `💡 *Solución: Ve a la configuración del servidor y arrastra mi rol para que esté por encima del rol que intentas configurar.*`,
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
          rol.position >= member.roles.highest.position &&
          user.id !== guild.ownerId
        ) {
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "## ❌ Permisos Insuficientes",
              ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `No puedes configurar el rol ${rol} porque está por encima (o al mismo nivel) de tu rol más alto.`,
              ),
            );

          await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [container],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        if (rol.permissions.has(PermissionsBitField.Flags.Administrator)) {
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "## ❌ Riesgo de Seguridad Crítico",
              ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `No puedes añadir el rol ${rol} al sistema porque posee permisos de **Administrador**.\n\n` +
                  `💡 *Entregar permisos administrativos automáticamente a los recién llegados es extremadamente peligroso para el servidor.*`,
              ),
            );

          await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [container],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        if (targetArray.includes(rol.id)) {
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Rol Duplicado"),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `El rol ${rol} ya se encuentra configurado actualmente en este sistema de autorol.\n\n` +
                  `💡 *No es necesario añadirlo dos veces. Si deseas quitarlo, utiliza el subcomando \`/autorole delete\`.*`,
              ),
            );

          await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [container],
            allowedMentions: { repliedUser: false },
          });

          return;
        }

        targetArray.push(rol.id);

        setData("autorole", guild.id, data);

        const successContainer = new ContainerBuilder()
          .setAccentColor(0x57f287)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## ✅ Configuración Exitosa"),
          )
          .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `El rol ${rol} ha sido enlazado correctamente al sistema de autoroles.\n\n` +
                `📌 **Categoría asignada:** ${type === "user" ? "👤 Usuarios" : "🤖 Bots"}`,
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
            return "```\nNingún rol configurado.\n```";
          }

          return roleArray.map((id) => `> <@&${id}>`).join("\n");
        };

        const usuariosText = formatRoles(data.usuarios);
        const botsText = formatRoles(data.bots);

        const viewContainer = new ContainerBuilder()
          .setAccentColor(0x5865f2)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              "## 📋 Configuración de Autoroles",
            ),
          );

        if (type === "user") {
          viewContainer.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `### 👤 Categoría: Usuarios\n\n` + `${usuariosText}`,
            ),
          );
        } else if (type === "bot") {
          viewContainer.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `### 🤖 Categoría: Bots\n\n` + `${botsText}`,
            ),
          );
        } else {
          viewContainer
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `### 👤 Categoría: Usuarios\n\n` + `${usuariosText}`,
              ),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `### 🤖 Categoría: Bots\n\n` + `${botsText}`,
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
        if (!role) {
          const errorContainer = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Faltan Datos"),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "Debes seleccionar un rol específico para poder eliminarlo.\n\n" +
                  "💡 *Asegúrate de hacer clic en las opciones que te sugiere el menú desplegable.*",
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

        if (data.usuarios.includes(role)) {
          data.usuarios = data.usuarios.filter((id) => id !== role);

          removedCategories.push("👤 Usuarios");
        }

        if (data.bots.includes(role)) {
          data.bots = data.bots.filter((id) => id !== role);
          removedCategories.push("🤖 Bots");
        }

        if (removedCategories.length === 0) {
          const notFoundContainer = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Rol No Encontrado"),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "Ese rol no se encuentra configurado en el sistema de autorol actual.",
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
            new TextDisplayBuilder().setContent(
              "## 🗑️ Configuración Eliminada",
            ),
          )
          .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `El rol <@&${role}> ha sido removido exitosamente del sistema.\n\n` +
                `📌 **Removido de la categoría:** ${removedCategories.join(" y ")}`,
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
   * @param {ChatInputCommandInteraction} interaction
   */
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();

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

    if (roleIdsToShow.length === 0) {
      await interaction.respond([]);

      return;
    }

    const choices = roleIdsToShow.map((id) => {
      const role = interaction.guild.roles.cache.get(id);
      return {
        name: role ? role.name : `⚠️ Rol fantasma/eliminado (${id})`,
        value: id,
      };
    });

    const filteredChoices = choices.filter((choice) =>
      choice.name.toLowerCase().includes(focusedValue.toLowerCase()),
    );

    await interaction.respond(filteredChoices.slice(0, 25));
  },
};
