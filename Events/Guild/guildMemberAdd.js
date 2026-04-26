const { Events, PermissionsBitField } = require("discord.js");
const { getData } = require("../Client/dbManager");
require("colors");

module.exports = {
  name: Events.GuildMemberAdd,
  on: true,
  /**
   *
   * @param {import("discord.js").GuildMember} member
   */
  async execute(member) {
    const { guild, user } = member;

    const data = getData("autorole", guild.id);

    if (!data) return;

    const botsMember = guild.members.me;

    const rolesIds = user.bot ? data.bots : data.usuarios;

    if (!rolesIds || rolesIds.length === 0) return;

    const rolesToAssign = [];

    for (const roleId of rolesIds) {
      const role = guild.roles.cache.get(roleId);

      if (!role) continue;

      if (role.position >= botsMember.roles.highest.position) continue;

      if (role.permissions.has(PermissionsBitField.Flags.Administrator))
        continue;

      rolesToAssign.push(role.id);
    }

    if (rolesToAssign.length > 0) {
      await member.roles.add(rolesToAssign).catch((error) => {
        console.error(
          `❌ [Autorol] Falló la asignación de roles: ${error.message}`.red
            .bold,
        );
      });
    }
  },
};
