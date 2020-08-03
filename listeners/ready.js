const { Listener } = require("discord-akairo");
const Discord = require("discord.js");
const { isRolesMessage } = require("../functions.js")

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
		for (let [, guild] of this.client.guilds.cache.filter(g => this.client.testMode != (g.name != "Lonely Joe"))) {
			let ch_server_info = guild.channels.cache.find(c => c.name == "server-info")
			if (ch_server_info) {
				let messages = await ch_server_info.messages.fetch({ limit: 100 })
				if (messages.some(m => m.content.startsWith("**ROLES**"))) {
					console.log(`Found roles message for ${guild.name}`);
				}
			}
			if (guild.channels.cache.some(g => g.name == "whitelist")) {
				console.log(`Found whitelist channel for ${guild.name}`)
			}
		}
		this.client.user.setPresence(
			{
				activity: {
					name: "/help",
					type: "LISTENING"
				},
				status: "online"
			}
		);
	}
}

module.exports = ReadyListener;