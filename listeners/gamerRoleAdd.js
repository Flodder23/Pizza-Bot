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
		if (this.client.testMode != (member.guild.name != "Lonely Joe")) {
			for (let role of member.guild.roles) {
				if (role[1].name == "Gamers") {
					member.addRole(role[1]);
				}
			}
		}
	}
}

module.exports = gamerRoleAdd;