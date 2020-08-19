const { Command } = require("discord-akairo");
const Discord = require("discord.js");

const commandInfo = {
	id: "dice",
	aliases: [],
	args: [{id: "options", type: "string", default: "d6", match: "content"}],
	description: {
		short: "Dice.",
		extend: "Rolls a dice of the given number (6 by default)",
	},
	regex: /^\/\d*d\d*(\s|$)/
}

//commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class diceCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	exec(message, args) {
		let options = message.content.substring(1).split(" ")
		options[0] = (" " + options[0] + " ").split("d")

		let dNumber=options[0][0]
		if (dNumber == " ") {
			dNumber = 1
		} else {
			dNumber = parseInt(dNumber)
		}

		let dValue=options[0][1]
		if (dValue == " ") {
			dValue = 6
		} else {
			dValue = parseInt(dValue)
		}

		let result = []

		for (let i = 0; i < dNumber; i++) {
			result.push(Math.floor(Math.random() * dValue + 1))
		}
		return message.channel.send(new Discord.MessageEmbed({
			title: result.reduce((a,b) => a + b, 0),
			description: result.join(", ")

		}))
	}
}

module.exports = diceCommand;