const { Command } = require("discord-akairo")
const { linkToMessage } = require("../../functions.js")

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
			let output = []
			if (msg.author.id != this.client.user.id) {
				output.push("Message not sent by this bot - to get bot to send a message, use the `echo` command.")
			}
			if (msg.channel.name != "server-info") {
				output.push("Message must be in channel called `server-info`.")
			}
			if (!msg.content.startsWith("**ROLES**")) {
				output.push("Message must start with \"**ROLES**\" (to get bold effect, type `**ROLES**`)")
			}
			if (output.length == 0) {
				return await message.channel.send({ embed: { description: "Roles message is valid." } })
			} else {
				return await message.channel.send({ embed: { description: output.join("\n") } })
			}
		} else {
			let roleMessages = []
			let channels = message.guild.channels.cache.filter(c => c.name == "server-info" && c.type == "text")
			if (channels.size == 0) {
				return await message.channel.send({ embed: { description: "Could not find channel named `server-info`." } })
			}
			for (let [, c] of channels) {
				roleMessages.push(...c.messages.cache.filter(m => m.author.id == this.client.user.id && m.content.startsWith("**ROLES**")).array())
			}
			if (roleMessages.length == 0) {
				return await message.channel.send({ embed: { description: `Could not find roles message in ${channels.map(c => c.toString()).join(", ")}.` } })
			} else if (roleMessages.length == 1) {
				return await message.channel.send({ embed: { description: `Roles message found. [goto](${roleMessages[0].url})` } })
			} else {
				return await message.channel.send({ embed: { description: `Warning - multiple role messages found. ${roleMessages.map(m => `[goto](${m.url})`).join(" ")}` } })
			}
		}
	}
}


module.exports = CheckRoleMessageCommand;