const { Listener } = require("discord-akairo");

class WelcomeListener extends Listener {
	constructor() {
		super(
			"welcome",
			{
				emitter: "client",
				eventName: "guildMemberAdd"
			}
		);
	}

	exec(member) {
		member.guild.systemChannel.send(`Welcome to the **${member.guild.name}** server, ${member}`);
	}
}

module.exports = WelcomeListener;