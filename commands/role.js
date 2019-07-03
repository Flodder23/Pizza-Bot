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
		message.guild.channels.forEach(function(channel) {
			if (channel.name == "server-info") {
				message.reply(`React to the message in ${channel} to get a role.`);
			}
		})
	}
}

module.exports = RoleCommand;