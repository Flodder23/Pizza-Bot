const { Listener } = require("discord-akairo");

class roleRemoveWhitelistRemoveListener extends Listener {
	constructor() {
		super(
			"roleRemoveWhitelistRemove",
			{
				emitter: "client",
				event: "guildMemberUpdate"
			}
		);
	}

	async exec(oldMember, newMember) {
		if (this.client.testMode == (oldMember.guild.name == "Lonely Joe")) {
			for (let role of oldMember.roles.cache) {
				if (typeof newMember.roles.cache.get(role[0]) == "undefined") {
					if (role[1].name == "Minecraft") {
						let ch_whitelist, ch_console;
						for (let channel of newMember.guild.channels.cache) {
							if (channel[1].name == "whitelist") {
								ch_whitelist = channel[1];
							} else if (channel[1].name == "server-console") {
								ch_console = channel[1];
							}
						}
						if (ch_whitelist && ch_console) {
							let messages = await ch_whitelist.messages.fetch({ limit: 100 })
							for (let m of messages) {
								if (m[1].author.id == newMember.id) {
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

module.exports = roleRemoveWhitelistRemoveListener;