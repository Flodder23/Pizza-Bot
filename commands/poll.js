const { Command } = require("discord-akairo");
const Discord = require("discord.js");
const config = require("../config.js");

class PollCommand extends Command {
	constructor() {
		super("poll", {
			aliases: ["poll"],
			args: [{id: "options", type: "string", match: "content"}],
			description: "Creates a poll with the given options.\nOptions should be seperated by a semi-colon, like this: `question; option 1; option 2; option 3` etc."
		});
	}
	async exec(message, args) {
		let options = args.options.split(";").map(item => item.trim());
		let d = 0;
		for (let i = 0; i < options.length + d; i++) {
			if (options[i - d] == "") {
				options.splice(i - d, 1);
				d ++;
			}
		}

		if (3 <= options.length && options.length <= 20) {
			let nickname = message.member.nickname
			if (nickname == null) {nickname = message.member.user.username}
			let question = options.shift();
			for (let i = 0; i < options.length; i++) {
				options[i] = [config.emoji_letters[i], options[i]]
			}

			let sent = await message.channel.send(
				new Discord.RichEmbed()
				.setColor(config.colour)
				.setAuthor(nickname + " asked:", message.member.user.avatarURL)
				.addField(question, options.map(item => item.join(" - "))))
			for (let i = 0; i < options.length; i++) {
				await sent.react(config.emoji_letters[i]);
			}
			await message.delete();
		} else {
			return message.reply("Something went wrong - options should be seperated by a semi-colon, like this: `question; option 1; option 2; option 3` etc. and there should be between 2 and 20 options.")
		}
	}
}


module.exports = PollCommand;