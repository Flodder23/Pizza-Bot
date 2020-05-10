const { Command } = require("discord-akairo");
const Discord = require("discord.js");
const config = require("../config.js");

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

class HelpCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}
	exec(message, args) {
		if (args.command) {
			return message.channel.send(new Discord.MessageEmbed()
				.setColor(config.colour)
				.setTitle(`**Help for ${args.command.id} command**`)
				.setURL(`https://github.com/JosephLGibson/Pizza-Bot/tree/master/commands/${args.command.id}.js`)
				.addField("Aliases", ` - ${args.command.aliases.join("\n - ")}\n`)
				.addField("Description", args.command.description.long)
				.addField("Usage", `\`${config.prefix + args.command.id} <${args.command.description.args.join("> <")}>\``)
			);
		} else if (message.content.split(" ").length == 1) {
			let cmds = [];
			for (let item of this.handler.modules) {
				cmds.push([item[0], item[1].description.short])
			}
			return message.channel.send(new Discord.MessageEmbed()
				.setColor(config.colour)
				.setTitle("Help")
				.setURL(`https://github.com/JosephLGibson/Pizza-Bot`)
				.setDescription(`Type \`${this.client.commandHandler.prefix}help <command>\` for more information on a command.`)
				.addField("Commands", `• ${cmds.map(item => item[0]).join("\n• ")}`, true)
				.addField("Description", cmds.map(item => item[1]).join("\n"), true)
				.addField("Roles", "React to the message in <#444896654986969089> to get a role.")
			);
		} else {
			return message.reply("Sorry, couldn't find that command.")
		}
	}
}

module.exports = HelpCommand;