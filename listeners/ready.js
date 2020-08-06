const { Listener } = require("discord-akairo");
const Discord = require("discord.js");
const { isRolesMessage } = require("../functions.js")
const config = require("../config.js")

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
		let output = ""
		if (this.client.testMode) {
			output += "Started in testing mode\n"
		} else {
			output += "Started in normal mode\n"
		}
		for (let [, guild] of this.client.guilds.cache.filter(g => this.client.testMode != (g.name != "Lonely Joe"))) {
			let ch_server_info = guild.channels.cache.find(c => c.name == "server-info")
			if (ch_server_info) {
				let messages = await ch_server_info.messages.fetch({ limit: 100 })
				if (messages.some(m => m.content.startsWith("**ROLES**"))) {
					output += `Found roles message for ${guild.name}\n`
				}
			}
			if (guild.channels.cache.some(g => g.name == "whitelist")) {
				output += `Found whitelist channel for ${guild.name}\n`
			}
		}
		output = output.trim()
		await this.client.user.setPresence(
			{
				activity: {
					name: "/help",
					type: "LISTENING"
				},
				status: "online"
			}
		)
		if (this.client.testMode) {
			console.log(output)
		} else {
			if (this.client.ownerUser) {
				await this.client.ownerUser.send({embed:{
					title: "Bot Restarted",
					description: output,
					color: config.colour,
					timestamp: new Date()
				}})
			} else {console.log(output)}
		}
	}
}

module.exports = ReadyListener;