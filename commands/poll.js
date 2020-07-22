const { Command } = require("discord-akairo");
const Discord = require("discord.js");
const config = require("../config.js");

async function getPing(str, guild) {
	if (Discord.MessageMentions.ROLES_PATTERN.test(str) || Discord.MessageMentions.USERS_PATTERN.test(str)) {
		return str
	}
	if (str.match(/^@?((h(ere)?)|(e(veryone)?))$/i)) {
		if (str.includes("h")) {
			return "@here"
		} else {
			return "@everyone"
		}
	}
	// let member = await guild.members.fetch({query: str, limit: 1})
	// if (member.array().length > 0) {
	// 	console.log(member)
	// 	return member.array()[0]
	// }
	let members = guild.members.cache
	for (let member of members) {
		if (
			member[1].user.username.toLowerCase().includes(str.toLowerCase()) ||
			member[1].displayName.toLowerCase().includes(str.toLowerCase()) ||
			member[1].id == str
		) {
			return member[1]
		}
	}
	let roles = guild.roles.cache
	for (let role of roles) {
		if (
			role[1].name.toLowerCase().includes(str.toLowerCase()) ||
			role[1].id == str
		) {
			return role[1]
		}
	}
	return null
}

const commandInfo = {
	id: "poll",
	aliases: [],
	args: [{id: "arguments", type: "string", match: "content"}],
	description: {
		short: "Creates a poll.",
		extend: `The pings, question and options should be seperated by a semi-colon, like this: \`ping1; ping2; ... ; question; option1; option2; ...\` etc.
		The first argument that isn't resolved as a ping will be treated as the question and all arguments after will be the options
		When checking for a ping, it is first checked whether the string is already a ping, then whether it matches to a member, and finally whether it matches to a role.`
	}
}


commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class PollCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	async exec(message, args) {
		let msg = message.content.split(" ")
		msg.splice(0, 1)
		msg = msg.join(" ");
		let options = msg.split(";").map(item => item.trim()).filter(o => o != "");

		let question;
		let pings = [];
		while (!question) {
			if (options.length < 3) {
				return await message.channel.send(`Not enough options - type \`${config.prefix}help poll\` for help on using this command`)
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
				title: "Poll",
				description: [`**${message.author} asked:**`, question, "", ...options.map(item => item.join(" - "))].join("\n")
			}}
		)
		for (let i = 0; i < options.length; i++) {
			await sent.react(config.emoji_letters[i]);
		}
		if (message.channel.type != "dm") {
			return await message.delete();
		} else {
			return message.reply(`Something went wrong - type \`${config.prefix}help poll\` for help on using this command`)
		}
	}
}


module.exports = PollCommand;