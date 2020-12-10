const { Listener } = require("discord-akairo");
const checkValid = /^[0-9A-Za-z_]+$/

class messageDeleteUsernameDeleteListener extends Listener {
	constructor() {
		super(
			"messageDeleteUsernameDelete",
			{
				emitter: "client",
				event: "messageDelete"
			}
		);
	}

	async exec(message) {
		if (message.channel.type != "dm" && this.client.testMode == (message.guild.id == "394948324999954432")) {
			if (message.channel.name == "whitelist") {
				if (message.author.id != this.client.user.id) {
					if (checkValid.test(message.content)) {
						let messageHistory = await message.channel.messages.fetch({ limit: 1, after: message.id })
						if (messageHistory.filter(m => m.author.id == this.client.user.id && m.content.includes(`> has already whitelisted \`${message.content}\`.`)).size == 0) {
							return await message.guild.channels.cache.find(c => c.name == "server-console").send(`whitelist remove ${message.content}`)
						}
					}
				}
			}
		}
	}
}

module.exports = messageDeleteUsernameDeleteListener;