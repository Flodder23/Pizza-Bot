const { Listener } = require("discord-akairo");

class gamerRoleAdd extends Listener {
	constructor() {
		super(
			"gamerRoleAdd",
			{
				emitter: "client",
				eventName: "guildMemberAdd"
			}
		);
	}

	exec(member) {
		member.guild.roles.forEach(function(role) {
			if (role.name == "Gamers") {
				member.addRole(role);
			}
		});
	}
}

module.exports = gamerRoleAdd;