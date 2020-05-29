const { Listener } = require("discord-akairo");
const Discord = require("discord.js");

class ReadyListener extends Listener {
	constructor() {
		super(
			"ready",
			{
				emitter: "client",
				event: "ready"
			}
		);
	}

	async exec() {
		if (this.client.testMode) {
			console.log("Started in testing mode.");
		} else {
			console.log("Started in normal mode.");
		}
		for (let guild of this.client.guilds.cache) {
			if (this.client.testMode != (guild[1].name != "Lonely Joe")) {
				for (let channel of guild[1].channels.cache) {
					if (channel[1].name == "server-info") {
						let messages = await channel[1].messages.fetch({ limit: 100 })
						for (let message of messages) {
							if (message[1].content.startsWith("**ROLES**")) {
								console.log(`Found roles message for ${guild[1].name}`);
							}
						}
					} else if (channel[1].name == "whitelist") {
						await channel[1].messages.fetch({ limit: 100 })
						console.log(`Found whiteslist channel for ${guild[1].name}`);
					}
				}
			}
		}
	}
}

module.exports = ReadyListener;