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
		console.log("Ready");

		this.client.guilds.forEach(async function(guild) {
			guild.channels.forEach(async function(channel) {
				if (channel.name == "server-info") {
					let messages = await channel.fetchMessages(10)
					messages.forEach(function(message) {
						if (message.content.startsWith("**ROLES**")) {
							console.log(`Found roles message for ${guild.name}`);
						}
					});
				}
			});
		});
	}
}

module.exports = ReadyListener;