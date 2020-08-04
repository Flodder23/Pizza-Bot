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
		if (this.client.ownerUser && !this.client.testMode) {
			let path = error.stack.split("\n")[1].split("/app/").pop()
			let lineNumber = path.split(".js:").pop().split(":")[0]
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
		} else {
			console.log(error.stack)
		}
	}
}

module.exports = DMOnErrorListener;