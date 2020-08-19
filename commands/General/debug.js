const { Command } = require("discord-akairo");
const config = require("../../config.js");
const category = require("./categoryInfo.json").name

const commandInfo = {
	id: "debug",
	aliases: [],
	args: [{id: "arguments", type: "string", match: "content"}],
	description: {
		short: "Command for debugging",
		extend: "",
	},
	category: category
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class DebugCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	async exec(message, args) {
		for (let [, category] of this.handler.categories) {
			console.log("CATEGORY:")
			console.log(category.id)
			console.log("COMMANDS:")
			for (let [, command] of category) {
				console.log(command.id)
			}
		}
	}
}

module.exports = DebugCommand;
