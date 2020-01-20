const { Listener } = require("discord-akairo");
const Discord = require("discord.js");

class ReactRoleRemoveListener extends Listener {
	constructor() {
		super(
			"reactRoleRemove",
			{
				emitter: "client",
				eventName: "messageReactionRemove"
			}
		);
	}

	async exec(messageReaction, user) {
		if (!this.client.testMode) {
			let message = messageReaction.message;
			let bot_id = this.client.user.id;
			if (message.author.id == this.client.user.id) {
				if (message.channel.name == "server-info") {
					if (message.content.startsWith("**ROLES**")) {
						let member = await message.guild.fetchMember(user.id);
						for (let role of message.guild.roles) {
							if (role[1].name == messageReaction.emoji.name){
								member.removeRole(role[1]);
								if (role[1].name == "Minecraft"){
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
											if (m[1].author.id == user.id) {
												await ch_console.send(`whitelist remove ${m[1].content}`)
												await m[1].delete()
											}
										}
									}
								}
							}
						}
					} 
				}
			}
		}
	}
}

module.exports = ReactRoleRemoveListener;