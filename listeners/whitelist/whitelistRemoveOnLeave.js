const { Listener } = require("discord-akairo");

class WhitelistRemoveOnLeave extends Listener {
	constructor() {
		super(
			"WhitelistRemoveOnLeave",
			{
				emitter: "client",
				event: "guildMemberRemove"
			}
		);
	}

	async exec(member) {
		if (this.client.testMode == (member.guild.name == "Lonely Joe")) {
			let messages = await member.guild.channels.cache.find(c => c.type == "text" && c.name == "whitelist").messages.fetch({ limit: 100 });
			for (let [, m] of messages.filter(m => m.author.id == member.id)) {
				await m.delete()
			}
		}
	}
}

module.exports = WhitelistRemoveOnLeave;