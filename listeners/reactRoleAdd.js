const { Listener } = require("discord-akairo");
const { isRolesMessage } = require("../functions.js")

class ReactRoleAddListener extends Listener {
	constructor() {
		super(
			"reactRoleAdd",
			{
				emitter: "client",
				event: "messageReactionAdd"
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
					return await member.roles.add(role)
				} else {
					return await messageReaction.remove(user)
				}
			}
		}
	}
}

module.exports = ReactRoleAddListener;