const { Command } = require("discord-akairo")
const { isRolesMessage, linkToMessage } = require("../../functions.js")

const commandInfo = {
	id: "checkRoleReacts",
	aliases: [],
	args: [{id: "messageLink", type: "string"}],
	description: {
		short: "Checks that all reacts on the given roles message are from users with the corresponding role.",
		extend: "If no link to a message is given, the bot will try to find it itself.\nTo get the link to a message, right-click on it (or click the 3 dots at the top-right of the message) and click `Copy Message Link`",
	}
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class CheckRoleReactsCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	async exec(message, args) {
		let roleMessage;
		if (args.messageLink) {
			roleMessage = linkToMessage(args.messageLink, message.guild)
			if (typeof roleMessage == "string") {
				return await message.channel.send({ embed: { description: roleMessage } })
			} else if (!isRolesMessage(message)) {
				return await message.channel.send({ embed: { description: "Not a valid role message. Use the `checkRoleMessage` command for more info." } })
			}
		} else {
			let channels = message.guild.channels.cache.filter(c => c.name == "server-info" && c.type == "text")
			for (let [, c] of channels) {
				roleMessage = c.messages.cache.find(m => m.author.id == this.client.user.id && m.content.startsWith("**ROLES**"))
				if (roleMessage) {
					break
				}
			}
			if (!roleMessage) {
				return await message.channel.send({ embed: { description: "Couldn't find role message. Use the `checkRoleMessage` command for more info." } })
			}
		}
		let valid = 0,				// The react was valid
			memberWithoutRole = 0,	// The member who reacted does not have the role 
			leftMembers = 0,		// The react does not have an asssociated role
			reactWithoutRole = 0;	// The member has left
		for (let [, react] of roleMessage.reactions.cache) {
			let role = message.guild.roles.cache.find(role => role.name.replace(" ", "").toLowerCase() == react.emoji.name.toLowerCase())
			if (role) {
				for (let [, u] of await react.users.fetch({ limit: 100 })) {
					let member = await message.guild.members.fetch(u)
					if (member) {
						if (member.roles.cache.find(r => r.id == role.id)) {
							valid ++;
						} else {
							memberWithoutRole ++;
						}
					} else {
						leftMembers ++;
					}
				}
			} else {
				reactWithoutRole ++;
			}
		}
		return await message.channel.send({ embed: {
			title: "Role react check results",
			description:`Checked [this message](${roleMessage.url})
			\`${valid}\` valid reacts
			\`${memberWithoutRole}\` reactions are from users who don't ahve the associated role
			\`${leftMembers}\` reactions are from users who are no longer in the server
			\`${reactWithoutRole}\` reactions don't have an associated role
			
			Wrong message found? Run the \`checkRoleMessage\` command for help.`,
		}})
	}
}


module.exports = CheckRoleReactsCommand;