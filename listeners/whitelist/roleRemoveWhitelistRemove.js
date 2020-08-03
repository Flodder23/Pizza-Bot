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
			let roleRemoved = await oldMember.roles.cache.find(r => !newMember.roles.cache.has(r.id))
			if (roleRemoved && roleRemoved.name == "Minecraft") {
				let ch_whitelist = await newMember.guild.channels.cache.find(c => c.name == "whitelist")
				let usernames = await ch_whitelist.messages.fetch({ limit: 100 })
				for (let [, u] of usernames.filter(m => m.author.id == newMember.id)) {
					await u.delete({ reason: "Role Removed" })
				}
			}
		}
	}
}

module.exports = roleRemoveWhitelistRemoveListener;