const { Listener } = require("discord-akairo");
const Discord = require("discord.js");

class WhitelistRemoveOnLeave extends Listener {
	constructor() {
		super(
			"WhitelistRemoveOnLeave",
			{
				emitter: "client",
				eventName: "guildMemberRemove"
			}
		);
	}

	async exec(member) {
		let ch_whitelist, ch_console;
		member.guild.channels.forEach(async function(channel) {
			if (channel.name == "whitelist") {
				ch_whitelist = channel;
			} else if (channel.name == "server-console") {
				ch_console = channel;
			}
		});

		if (ch_whitelist && ch_console) {
			let messages = await ch_whitelist.fetchMessages(100);
			for (let m of messages) {
				if (m[1].author.id == member.id) {
					await ch_console.send(`whitelist remove ${m[1].content}`)
					await m[1].delete()
				}
			}
		}
	}
}

module.exports = WhitelistRemoveOnLeave;