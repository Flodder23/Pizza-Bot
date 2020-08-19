const { Command } = require("discord-akairo")
const config = require("../../config.js")
const { getPing } = require("../../functions.js")

const commandInfo = {
	id: "ask",
	aliases: ["yesno", "h", "here", "e", "everyone"],
	args: [{id: "question", type: "string", default: "", match: "content"}],
	description: {
		short: "Ask a yes/no question.",
		extend: "Use the `here`/`h` or `everyone`/`e` aliases to ping that role as well.\nYou can also ping other roles/users - seperate your pings with a semi-colon (`;`) before the question, like this: `ping1; ping2;...;question`",
	}
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class AskCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	async exec(message, args) {
		const cmdInfo = await this.client.commandHandler.parseCommand(message)
		let options = args.question.split(";")

		let question
		let pings = [];
		if (cmdInfo.alias.startsWith("h")) {
			pings.push("@here")
		} else if (cmdInfo.alias.startsWith("e")) {
			pings.push("@everyone")
		}
		while (!question) {
			if (options.length == 1) {
				question = options[0]
				break
			}
			if (options[0] == "") {
				options.shift()
				continue
			}
			let ping = await getPing(options[0].trim(), message.guild)
			if (ping) {
				pings.push(ping)
			} else {
				question = options.join(";")
			}
			options.shift()
		}

		let sent = await message.channel.send(
			pings.join(" "),
			{embed: {
				color: config.colour,
				description: `**${message.author} asked**:\n${question}`
			}}
		)
		await sent.react(config.yes_react);
		await sent.react(config.no_react);
		if (message.channel.type != "dm" && !this.client.testMode) {
			return await message.delete();
		}
	}
}

module.exports = AskCommand;
