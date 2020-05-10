const { Command } = require("discord-akairo");
const Discord = require("discord.js");
const config = require("../config.js");

class HelpCommand extends Command {
	constructor() {
		super(
			"help",
			{
				aliases: ["help", "info", "command"],
				args: [{id: "command", type: "commandAlias"}],
				description: `Shows help message.\nIf no command is given it gives a general overview of all possible commands.`,
			}
		);
	}
	exec(message, args) {
		if (args.command) {
			return message.channel.send(new Discord.MessageEmbed()
				.setColor(config.colour)
				.setTitle(`**Help for ${args.command.id} command**`)
				.setURL(`https://github.com/JosephLGibson/Pizza-Bot/tree/master/commands/${args.command.id}.js`)
				.addField("Aliases", ` - ${args.command.aliases.join("\n - ")}\n`)
				.addField("Description", args.command.description + "\n")
				//.addField("Usage", `\`${this.client.commandHandler.prefix + args.command.id} <${args.command.args.map(item => item.id).join("> <")}>\``)
			);
		} else if (message.content.split(" ").length == 1) {
			let cmds = [];
			for (let item of this.handler.modules) {
				cmds.push([item[0], item[1].description.split("\n")[0]])
			}
			return message.channel.send(new Discord.MessageEmbed()
				.setColor(config.colour)
				.setTitle("Help")
				.setURL(`https://github.com/JosephLGibson/Pizza-Bot`)
				.setDescription(`Type \`${this.client.commandHandler.prefix}help <command>\` for more information on a command.`)
				.addField("Commands", `• ${cmds.map(item => item[0]).join("\n• ")}`, true)
				.addField("Description", cmds.map(item => item[1]).join("\n"), true)
			);
		} else {
			return message.reply("Sorry, couldn't find that command.")
		}
	}
}

module.exports = HelpCommand;