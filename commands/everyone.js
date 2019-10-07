const { Command } = require("discord-akairo");
const config = require("../config.js");

class PlayCommand extends Command {
	constructor(){
		super(
			"everyone",
			{
				aliases: ["everyone", "e"],
				args: [{id: "message", type: "string", default: "", match: "content"}],
				description: "Ping @everyone with a yes/no question.\n You can also add a custom message."
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
		let sent = await message.channel.send(`**${start}** asked: @everyone ${end}?`);
		message.delete();
		await sent.react(config.yes_react)
		sent.react(config.no_react);
		
	}
}

module.exports = PlayCommand;