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
		let message = messageReaction.message;
		if (message.author.id == this.client.user.id) {
			if (message.channel.name == "server-info") {
				if (message.content.startsWith("**ROLES**")) {
					let member = await message.guild.fetchMember(user.id);
					let found_role = false;
					message.guild.roles.forEach(function(role) {
						if (role.name == messageReaction.emoji.name){
							member.addRole(role);
							found_role = true
						}
					});
					if (!found_role) {
						messageReaction.remove(user);
					}
				} 
			}
		}
	}
}

module.exports = ReactRoleAddListener;