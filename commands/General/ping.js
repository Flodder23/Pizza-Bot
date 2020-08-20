const { Command } = require("discord-akairo");

const commandInfo = {
	id: "ping",
	aliases: [],
	args: [],
	description: {
		short: "Get the bot's ping.",
		extend: "Gets time taken between the command being sent and the resulting \"pong\" message to be sent.",
	}
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)
commandInfo.category = __dirname.split("\\").pop()

class PingCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	exec(message) {
		return message.reply("pong").then(sent => {
			sent.edit(`${sent} (${sent.createdAt - message.createdAt}ms)`);
		});
	}
}

module.exports = PingCommand;