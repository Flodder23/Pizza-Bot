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
		if (!this.client.testMode || member.guild.name == "Lonely Joe") {
			let ch_whitelist, ch_console;
			for (let channel of member.guild.channels.cache) {
				if (channel[1].name == "whitelist") {
					ch_whitelist = channel[1];
				} else if (channel[1].name == "server-console") {
					ch_console = channel[1];
				}
			}

			if (ch_whitelist && ch_console) {
				let messages = await ch_whitelist.messages.fetch({ limit: 100 });
				for (let m of messages) {
					if (m[1].author.id == member.id) {
						await ch_console.send(`whitelist remove ${m[1].content}`)
						await m[1].delete()
					}
				}
			}
		}
	}
}

module.exports = WhitelistRemoveOnLeave;