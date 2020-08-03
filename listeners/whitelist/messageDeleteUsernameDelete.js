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
		if (message.channel.type != "dm" && this.client.testMode == (message.guild.name == "Lonely Joe")) {
			if (message.channel.name == "whitelist") {
				if (message.author.id != this.client.user.id) {
					if (checkValid.test(message.content)) {
						let messageHistory = await message.channel.messages.fetch({ limit: 1 })
						let lastMessage;
						for (let m of messageHistory) {
							lastMessage = m[1]
						}
						if (typeof lastMessage != "undefined" && lastMessage.author.id == this.client.user.id) {
							if (!lastMessage.content.includes("> has already whitelisted `")) {
								return await message.guild.channels.cache.find(c => c.name == "server-console").send(`shitelist remove ${message.content}`)
							}
						}
					}
				}
			}
		}
	}
}

module.exports = messageDeleteUsernameDeleteListener;