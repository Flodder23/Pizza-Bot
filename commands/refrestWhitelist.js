const { Command } = require("discord-akairo");

class RefreshWhitelistCommand extends Command {
	constructor() {
		super("refreshWhitelist", {
			aliases: ["refreshWhitelist"],
			description: "Adds every person on the whitelist in Discord to the Minecraft whitelist"
		});
	}
	exec(message) {
		let ch_whitelist, ch_console;
		for (let channel of message.guild.channels) {
			if (channel[1].name == "whitelist") {
				ch_whitelist = channel[1];
			} else if (channel[1].name == "server-console") {
				ch_console = channel[1];
			}
		}
		if (ch_whitelist && ch_console) {
			let messages = await ch_whitelist.fetchMessages(100);
			for (let m of messages) {
				if (m[1].author.id != this.client.user.id) {
					await ch_console.send(`whitelist add ${m[1].content}`)
				}
			}
		}
	}
}

module.exports = RefreshWhitelistCommand;
