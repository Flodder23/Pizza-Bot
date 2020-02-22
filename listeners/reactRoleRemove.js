const { Listener } = require("discord-akairo");

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
		if (this.client.testMode != (messageReaction.message.guild.name != "Lonely Joe")) {
			let message = messageReaction.message;
			let bot_id = this.client.user.id;
			if (message.author.id == this.client.user.id) {
				if (message.channel.name == "server-info") {
					if (message.content.startsWith("**ROLES**")) {
						let member = await message.guild.fetchMember(user.id);
						for (let role of message.guild.roles) {
							if (role[1].name.replace(" ", "") == messageReaction.emoji.name){
								member.removeRole(role[1]);
							}
						}
					}
				}
			}
		}
	}
}

module.exports = ReactRoleRemoveListener;