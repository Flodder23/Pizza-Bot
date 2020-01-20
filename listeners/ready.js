const { Listener } = require("discord-akairo");
const { Discord } = require("discord.js");

class ReadyListener extends Listener {
	constructor() {
		super(
			"ready",
			{
				emitter: "client",
				eventName: "ready"
			}
		);
	}

	async exec() {
		if (this.client.testMode) {
			console.log("Starting in testing mode.");
		} else {
			console.log("Starting in normal mode.");
			for (let guild of this.client.guilds) {
				for (let channel of guild[1].channels) {
					if (channel[1].name == "server-info") {
						let messages = await channel[1].fetchMessages(100)
						for (let message of messages) {
							if (message[1].content.startsWith("**ROLES**")) {
								console.log(`Found roles message for ${guild[1].name}`);
							}
						}
					}
				}
			}
		}
	}
}

module.exports = ReadyListener;