const { Command } = require("discord-akairo")
const { checkRoleMessage, getRoleMessage, linkToMessage } = require("../../functions.js")

const commandInfo = {
	id: "checkRoleMessage",
	aliases: [],
	args: [{id: "messageLink", type: "string"}],
	description: {
		short: "Checks that the bot can find & see the react message in this server",
		extend: "If no link to a message is given, the bot will try to find it itself.\nTo get the link to a message, right-click on it (or click the 3 dots at the top-right of the message) and click `Copy Message Link`",
	}
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)
commandInfo.category = __dirname.split("\\").pop()

class CheckRoleMessageCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	async exec(message, args) {
		if (args.messageLink) {
			let msg = linkToMessage(args.messageLink, message.guild)
			if (typeof msg == "string") {
				return await message.channel.send({ embed: { description: msg } })
			}
			return await message.channel.send(checkRoleMessage(msg, this.client.user.id))
		} else {
			let roleMessages = getRoleMessage(message.guild, this.client.user.id, false)
			if (typeof roleMessages == "string") {
				return await message.channel.send({ embed: { description: roleMessages } })
			} else if (roleMessages.length == 0) {
				return await message.channel.send({ embed: { description: `Could not find roles message in ${message.guild.channels.cache.filter(c => c.name == "server-info" && c.type == "text").map(c => c.toString()).join(", ")}.` } })
			} else if (roleMessages.length == 1) {
				return await message.channel.send({ embed: { description: `Roles message found: [goto](${roleMessages[0].url})` } })
			} else {
				return await message.channel.send({ embed: { description: `Multiple role messages found: ${roleMessages.map(m => `[goto](${m.url})`).join(" ")}` } })
			}
		}
	}
}


module.exports = CheckRoleMessageCommand;