const { Command } = require("discord-akairo")
const Discord = require("discord.js")
const { constructCommandInfo } = require("../../functions.js")
const diceRegex = /^\/\d*d\d+(\s|$)/

const commandInfo = constructCommandInfo(
	{
		id: "dice",
		aliases: [],
		args: [{id: "options", type: "string", default: "d6", match: "content"}],
		description: {
			short: "Dice.",
			extend: "Rolls a dice of the given number (6 by default).\nOptions should look like `d6`, `4d20` etc.\nYou can also just type `=4d20` to use this command.",
		},
		regex: diceRegex
	},
	 __dirname
)

class diceCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	async exec(message, args) {
		let options;
		if (message.content.includes("dice")) {
			options = args.options.split(" ")[0]
			if (!diceRegex.test("/" + options)) {
				return await message.channel.send("Invalid dice options - options should look like `d6`, `4d20` etc.")
			}
		} else {
			options = message.content.split(" ")[0].substring(1)
		}
		options = options.split("d")
		let dNumber = options[0] == ""? 1 : parseInt(options[0])
		let dValue = parseInt(options[1])

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