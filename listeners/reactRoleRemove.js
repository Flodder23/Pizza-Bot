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
		let message = messageReaction.message;
		let bot_id = this.client.user.id;
		if (message.author.id == this.client.user.id) {
			if (message.channel.name == "server-info") {
				if (message.content.startsWith("**ROLES**")) {
					let member = await message.guild.fetchMember(user.id);
					message.guild.roles.forEach(async function(role) {
						if (role.name == messageReaction.emoji.name){
							member.removeRole(role);
							if (role.name == "Minecraft"){
								let ch_whitelist, ch_console;
								message.guild.channels.forEach(async function(channel) {
									if (channel.name == "whitelist") {
										ch_whitelist = channel;
									} else if (channel.name == "server-console") {
										ch_console = channel;
									}
								});

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
					});
				} 
			}
		}
	}
}

module.exports = ReactRoleRemoveListener;