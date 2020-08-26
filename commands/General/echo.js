const { Command } = require("discord-akairo")
const { constructCommandInfo } = require("../../functions.js")

const commandInfo = constructCommandInfo(
	{
		id: "echo",
		aliases: ["say"],
		args: [{id: "message", type: "string", default: "You need to specify what to echo", match: "content"}],
		description: {
			short: "Repeats the message back to you.",
			extend: "",
		}
	},
	__dirname
)

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