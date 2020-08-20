const { Command } = require("discord-akairo")
const Discord = require("discord.js")
const config = require("../../config.js")
const { getPing } = require("../../functions.js")

const commandInfo = {
	id: "poll",
	aliases: [],
	args: [{id: "arguments", type: "string", match: "content"}],
	description: {
		short: "Creates a poll.",
		extend: `The pings, question and options should be seperated by a semi-colon, like this: \`ping1; ping2; ... ; question; option1; option2; ...\` etc.
		The first argument that can't be resolved as a ping will be treated as the question and all arguments after will be the options
		When checking for a ping, it is first checked whether the string is already a ping, then whether it matches to a member, and finally whether it matches to a role.`
	}
}


commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)
commandInfo.category = __dirname.split("\\").pop()

class PollCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	async exec(message, args) {
		let options = args.arguments.split(";").map(item => item.trim()).filter(o => o != "");

		let question;
		let pings = [];
		while (!question) {
			if (options.length < 3) {
				return await message.channel.send(`Not enough options - type \`${this.client.commandHandler.prefix}help poll\` for help on using this command`)
			}
			let ping = await getPing(options[0], message.guild)
			if (ping) {
				pings.push(ping)
			} else {
				question = options[0]
			}
			options.shift()
		}
		for (let i = 0; i < options.length; i++) {
			options[i] = [config.emoji_letters[i], options[i]]
		}

		let sent = await message.channel.send(
			pings.map(p => p.toString()).join(" "),
			{ embed: {
				color: config.colour,
				description: [`**${message.author}'s poll:**`, question, "", ...options.map(item => item.join(" - "))].join("\n")
			}}
		)
		for (let o of options) {
			await sent.react(o[0]);
		}
		if (message.channel.type != "dm" && !this.client.testMode) {
			return await message.delete()
		}
	}
}


module.exports = PollCommand;