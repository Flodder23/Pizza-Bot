const { Command } = require("discord-akairo");
const Discord = require("discord.js");

class AvatarCommand extends Command {
	constructor() {
		super("avatar", {
			aliases: ["avatar", "pic"],
			args: [{id: "member", type: "member"}],
			description: "Shows avatar of selected user.\nIf no user is given, it shows the avatar of the user who called the command."});
	}

	exec(message, args) {
		if (message.content.split(" ").length == 1) {
			args.member = message.member
		}
		if (args.member) {
			message.channel.send(new Discord.RichEmbed()
				.setColor(16426522)
				.setImage(args.member.user.avatarURL));
		} else {
			message.reply("Sorry, couldn't find that user.")
		}
	}
}

module.exports = AvatarCommand;
