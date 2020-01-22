const { Listener } = require("discord-akairo");

class ReactRoleAddListener extends Listener {
	constructor() {
		super(
			"reactRoleAdd",
			{
				emitter: "client",
				eventName: "messageReactionAdd"
			}
		);
	}

	async exec(messageReaction, user) {
		if (this.client.testMode != (messageReaction.message.guild.name != "Lonely Joe")) {
			let message = messageReaction.message;
			if (message.author.id == this.client.user.id) {
				if (message.channel.name == "server-info") {
					if (message.content.startsWith("**ROLES**")) {
						let member = await message.guild.fetchMember(user.id);
						let found_role = false;
						for (let role of message.guild.roles) {
							if (role[1].name == messageReaction.emoji.name){
								member.addRole(role[1]);
								found_role = true
							}
						}
						if (!found_role) {
							messageReaction.remove(user);
						}
					} 
				}
			}
		}
	}
}

module.exports = ReactRoleAddListener;