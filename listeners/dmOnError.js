const { Listener } = require("discord-akairo");

class DMOnErrorListener extends Listener {
	constructor() {
		super(
			"dmOnError",
			{
				emitter: "commandHandler",
				event: "error"
			}
		);
	}

	async exec(error, message, command) {
		if (!this.client.testMode) {
			let errorChannel;
			if (message.channel.type == "dm") {
				if (message.channel.recipient.id == this.client.ownerID) {
					errorChannel = message.channel
				}
			} else if (message.channel.type == "text") {
				let owner = message.channel.members.find(m => m.id == this.client.ownerID)
				if (owner) {
					errorChannel = owner.user
				}
			}
			if (errorChannel) {
				let path = error.stack.split("\n")[1].split("/app/").pop()
				let lineNumber = path.split(".js:").pop().split(":")[0]
				path = path.split(".js:")[0] + ".js#L" + lineNumber
				errorChannel.send(errorChannel.toString(), {embed: {
					title: "Error",
					description: `\`\`\`js\n${error.stack}\`\`\``,
					fields: [
						{
							name: "message",
							value: message.content
						}, {
							name: "links",
							value: `[message](${message.url}) | [code in Github](https://github.com/JosephLGibson/Pizza-Bot/tree/master/${path})`
						}
					],
					timestamp: new Date(),
				}})
				console.log(`Message:\n${message.content}\n`)
			}
		}
		return console.log("Error:\n" + error.stack)
	}
}

module.exports = DMOnErrorListener;