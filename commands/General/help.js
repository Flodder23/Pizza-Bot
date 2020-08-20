const { Command } = require("discord-akairo");
const Discord = require("discord.js");
const { colour, categoryInfo } = require("../../config.js");

const commandInfo = {
	id: "help",
	aliases: ["info", "command"],
	args: [{id: "command", type: "commandAlias"}],
	description: {
		short: "Shows help message.",
		extend: "If no command is given it gives a general overview of all possible commands.",
	}
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)
commandInfo.category = __dirname.split("\\").pop()

class HelpCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}
	exec(message, args) {
		if (args.command) {
			return message.channel.send({embed: {
				color: colour,
				title: `**Help for ${args.command.id} command**`,
				url: `https://github.com/JosephLGibson/Pizza-Bot/tree/master/commands/${args.command.id}.js`,
				fields: [
					{
						name: "Aliases",
						value: ` - ${args.command.aliases.join("\n - ")}\n`
					}, {
						name: "Description",
						value:args.command.description.long
					}, {
						name: "Usage",
						value: `\`${this.client.commandHandler.prefix + args.command.id} <${args.command.description.args.join("> <")}>\``
					}, {
						name: "Permissions needed to use",
						value: args.command.userPermissions ? args.command.userPermissions.map(p => p.toLowerCase().replace("_", " ")).join(", ") : "None"
					}
				]
			}})
		} else if (message.content.split(" ").length == 1) {
			return message.channel.send({embed: {
				color: colour,
				title: "Pizza Bot help",
				url: `https://github.com/JosephLGibson/Pizza-Bot`,
				fields: [
					{
						name: " -- Roles -- ",
						value: `React to the message in ${message.guild.channels.cache.find(c => c.name == "server-info")} to get a role.`
					}, {
						name: " ---- COMMANDS ---- ",
						value: `Type \`${this.client.commandHandler.prefix}help <command>\` for more information on a command.`
					},
					...this.handler.categories.map(category => ({
						name: ` -- ${category.id} -- `,
						value: `${categoryInfo[category.id]}\n${category.map(command => `• **${command.id} -- **${command.description.short}`).join("\n")}`
					}))
				]
			}})
		} else {
			return message.reply(`Sorry, couldn't find that command. Type \`${this.client.commandHandler.prefix}help\` for a list of commands.`)
		}
	}
}

module.exports = HelpCommand;