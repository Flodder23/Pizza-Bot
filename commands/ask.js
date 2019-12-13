const { Command } = require("discord-akairo");
const config = require("../config.js");

class AskCommand extends Command {
	constructor() {
		super(
			"ask", 
			{
				aliases: ["ask", "yesno"],
				args: [{id: "message", type: "string", default: "", match: "content"}],
				description: "Ask a yes/no question."
			}
		)
	}

	async exec(message, args) {
		let end;
		if (args.message == ""){
			end = ""
		} else {
			end = " " + args.message
		}

		let name = message.member.user.username + "#" + message.member.user.discriminator
		let start;
		if (message.member.nickname == null ) {
			start = name
		} else {
			start = message.member.nickname + ` (${name})`
		}
		let sent = await message.channel.send(`**${start}** asked: ${end}?`);
		message.delete();
		await sent.react(config.yes_react);
		await sent.react(config.no_react);
	}
}

module.exports = AskCommand;
