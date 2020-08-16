const { Command } = require("discord-akairo")
const { linkToMessage } = require("../../functions.js")

const commandInfo = {
	id: "checkRoleMessage",
	aliases: [],
	args: [{id: "messageLink", type: "string"}],
	description: {
		short: "Checks that the bot can find & see the react message in this server",
		extend: "To get the link to a message, right-click on it (or click the 3 dots at the top-right of the message) and click `Copy Message Link`",
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
		let msg = linkToMessage(args.messageLink, message.guild)
		if (typeof msg == "string") {
			return await message.channel.send(msg)
		}
		let output = []
		if (msg.author.id != this.client.user.id) {
			output.push("Message not sent by this bot - to get bot to send a message, use the `echo` command")
		}
		if (msg.channel.name != "server-info") {
			output.push("Message must be in channel called `server-info`")
		}
		if (!msg.content.startsWith("**ROLES**")) {
			output.push("Message must start with \"**ROLES**\" (to get bold effect, type `**ROLES**`)")
		}
		if (output.length == 0) {
			return await message.channel.send("Roles message is valid.")
		} else {
			return await message.channel.send(output.join("\n"))
		}

	}
}


module.exports = CheckRoleMessageCommand;