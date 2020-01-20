const { Listener } = require("discord-akairo");
const Discord = require("discord.js");

class roleRemoveWhitelistRemove extends Listener {
	constructor() {
		super(
			"roleRemoveWhitelistRemove",
			{
				emitter: "client",
				eventName: "guildMemberUpdate"
			}
		);
	}

	async exec(oldMember, newMember) {
		if (this.client.testMode) {
			for (let role of oldMember.roles) {
				if (typeof newMember.roles.get(role[0]) == "undefined") {
					if (role[1].name == "Minecraft") {
						let ch_whitelist, ch_console;
						for (let channel of newMember.guild.channels) {
							if (channel[1].name == "whitelist") {
								ch_whitelist = channel[1];
							} else if (channel[1].name == "server-console") {
								ch_console = channel[1];
							}
						}
						if (ch_whitelist && ch_console) {
							let messages = await ch_whitelist.fetchMessages(100);
							for (let m of messages) {
								if (m[1].author.id == newMember.id) {
									await ch_console.send(`whitelist remove ${m[1].content}`)
									await m[1].delete()
								}
							}
						}
					}
					break
				}
			}
		}
	}
}

module.exports = roleRemoveWhitelistRemove;