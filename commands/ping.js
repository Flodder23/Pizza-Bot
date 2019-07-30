const { Command } = require("discord-akairo");

class PingCommand extends Command {
	constructor() {
		super("ping", {
			aliases: ["ping"],
			description: "Shows bot's ping.\nGets time taken between the command being sent and the resulting \"pong\" message to be sent."});
	}

	exec(message) {
		return message.reply("pong").then(sent => {
			sent.edit(`${sent} (${sent.createdAt - message.createdAt}ms)`);
		});
	}
}

module.exports = PingCommand;