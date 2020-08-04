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
		if (this.client.ownerUser) {
			let path = error.stack.split("\n")[1].split("Pizza-Bot").pop()
			let lineNumber = path.split(".js").pop().split(":")[1]
			path = path.split(".js:")[0] + ".js#L" + lineNumber
			return await this.client.ownerUser.send({embed: {
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
		}
	}
}

module.exports = DMOnErrorListener;