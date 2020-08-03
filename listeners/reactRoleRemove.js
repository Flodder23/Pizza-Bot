const { Listener } = require("discord-akairo")
const { isRolesMessage } = require("../functions.js")

class ReactRoleRemoveListener extends Listener {
	constructor() {
		super(
			"reactRoleRemove",
			{
				emitter: "client",
				event: "messageReactionRemove"
			}
		);
	}

	async exec(messageReaction, user) {
		let message = messageReaction.message;
		let member = await messageReaction.message.guild.members.fetch(user)
		if (message.channel.type != "dm" && this.client.testMode == (message.guild.name == "Lonely Joe")) {
			if (isRolesMessage(message, this.client.user.id)) {
				let role = message.guild.roles.cache.find(r => r.name.replace(" ", "").toLowerCase() == messageReaction.emoji.name.toLowerCase())
				if (role) {
					return await member.roles.remove(role)
				}
			}
		}
	}
}

module.exports = ReactRoleRemoveListener;