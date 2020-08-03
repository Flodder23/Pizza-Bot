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
		if (this.client.testMode == (member.guild.name == "Lonely Joe")) {
			return member.roles.add(member.guild.roles.cache.find(r => r.name == "Gamers"))
		}
	}
}

module.exports = gamerRoleAdd;