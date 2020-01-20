const { Command } = require("discord-akairo");

class RoleCommand extends Command {
	constructor() {
		super(
			"role",
			{
				aliases: ["role"],
				description: "React to the message in <#444896654986969089> to get a role"
			}
		)
	}

	exec(message) {
		for (let channel of message.guild.channels) {
			if (channel[1].name == "server-info") {
				message.reply(`React to the message in ${channel[1]} to get a role.`);
			}
		}
	}
}

module.exports = RoleCommand;