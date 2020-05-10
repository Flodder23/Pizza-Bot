const { Command } = require("discord-akairo");

const commandInfo = {
	id: "echo",
	aliases: ["say"],
	args: [{id: "message", type: "string", default: "You need to specify what to echo", match: "content"}],
	description: {
		short: "Repeats the message back to you.",
		extend: "",
	}
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class EchoCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	exec(message, args) {
		return message.channel.send(args.message);
	}
}

module.exports = EchoCommand;