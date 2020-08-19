const { Command } = require("discord-akairo")
const { isRolesMessage, linkToMessage } = require("../../functions.js")

const commandInfo = {
	id: "fixRoleReacts",
	aliases: [],
	args: [{id: "messageLink", type: "string"}],
	description: {
		short: "Gives role to every meeber who has reacted but does not have role",
		extend: "Also removes reacts from users no longer in the server",
	},
	userPermissions: ["MANAGE_ROLES", "MANAGE_MESSAGES"]
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class FixRoleReactsCommand extends Command {
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
			leftMembers = 0,		// The member has left
			reactWithoutRole = 0;	// The react does not have an asssociated role
		for (let [, react] of roleMessage.reactions.cache) {
			let role = message.guild.roles.cache.find(role => role.name.replace(" ", "").toLowerCase() == react.emoji.name.toLowerCase())
			if (role) {
				for (let [, u] of await react.users.fetch()) {
					let member = message.guild.members.cache.find(m => m.id == u.id)
					if (member) {
						if (member.roles.cache.some(r => r.id == role.id)) {
							valid ++;
						} else {
							memberWithoutRole ++;
							await member.roles.add(role)
						}
					} else {
						leftMembers ++;
						await react.users.remove(u)
					}
				}
			} else {
				reactWithoutRole += react.count
				await react.remove()
			}
		}
		return await message.channel.send({ embed: {
			title: "Role react fix results",
			description:`Fixed based on [this message](${roleMessage.url})
			\`${valid}\` valid reacts
			\`${memberWithoutRole}\` roles added to member who had reacted
			\`${leftMembers}\` reactions from users no longer in server removed
			\`${reactWithoutRole}\` reactions without an associated role removed
			
			Wrong message found? Run the \`checkRoleMessage\` command for help.`,
		}})
	}
}


module.exports = FixRoleReactsCommand;