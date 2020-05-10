const { Listener } = require("discord-akairo");

class gamerRoleAdd extends Listener {
	constructor() {
		super(
			"gamerRoleAdd",
			{
				emitter: "client",
				event: "guildMemberAdd"
			}
		);
	}

	exec(member) {
		if (this.client.testMode != (member.guild.name != "Lonely Joe")) {
			for (let role of member.guild.roles.cache) {
				if (role[1].name == "Gamers") {
					member.roles.add(role[1]);
				}
			}
		}
	}
}

module.exports = gamerRoleAdd;