const { Command } = require("discord-akairo");
const config = require("../config.js");

class PlayCommand extends Command {
	constructor(){
		super(
			"here",
			{
				aliases: ["here", "h"],
				args: [{id: "message", type: "string", default: "", match: "content"}],
				description: "Ping @here with a yes/no question.\n"
			}
		)
	}
	async exec(message, args) {
		let end;
		if (args.message == ""){
			let rep = await message.reply("can't ask an empty question!")
			await rep.delete(5000);
		} else {
			let name = message.author.username + "#" + message.author.discriminator
			let start;
			if (message.author.nickname == null ) {
				start = name
			} else {
				start = message.author.nickname + ` (${name})`
			}
			let sent = await message.channel.send(`**${start}** asked: @here ${args.message}`);
			await sent.react(config.yes_react);
			sent.react(config.no_react);
		}
		if (message.channel.type != "dm") {
			message.delete();
		}
	}
}

module.exports = PlayCommand;