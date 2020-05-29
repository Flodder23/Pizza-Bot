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
		if (message.channel.name == "whitelist") {
			if (message.author.id != this.client.user.id) {
				if (checkValid.test(message.content)) {
					let ch_console;
					for (let ch of message.guild.channels.cache) {
						if (ch[1].type == "text" && ch[1].name == "server-console") {
							ch_console = ch[1];
							break
						}
					}
					if (typeof ch_console != "udnefined") {
						ch_console.send(`whitelist remove ${message.content}`)
					}
				}
			}
		}
	}
}

module.exports = messageDeleteUsernameDeleteListener;