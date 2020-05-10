const { Command } = require("discord-akairo");
const config = require("../config.js");

const commandInfo = {
	id: "here",
	aliases: ["h"],
	args: [{id: "message", type: "string", default: "", match: "content"}],
	description: {
		short: "Ping @here with a yes/no question.",
		extend: "",
	}
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class HereCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
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

module.exports = HereCommand;