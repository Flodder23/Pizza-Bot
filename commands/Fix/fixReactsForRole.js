const { Command } = require("discord-akairo")
const { getRoleMessage } = require("../../functions.js")

const commandInfo = {
	id: "fixReactsForRole",
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
commandInfo.category = __dirname.split("\\").pop()

class FixReactsForRoleCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	async exec(message, args) {
		let roleMessage = getRoleMessage(message.guild, this.client.user.id)
		if (typeof roleMessage == "string") {
			return await message.channel.send({ embed: { description: roleMessage } })
		}
		let valid = 0,				// The react was valid
			memberWithoutRole = 0,	// The member who reacted does not have the role 
			leftMembers = 0,		// The member has left
			reactWithoutBot = 0,	// The bot has not done this valid reaction
			botReacts = 0,			// The bot did this reaction
			reactWithoutRole = 0;	// The react does not have an asssociated role
		for (let [, react] of roleMessage.reactions.cache) {
			let role = message.guild.roles.cache.find(role => role.name.replace(" ", "").toLowerCase() == react.emoji.name.toLowerCase())
			if (role) {
				for (let [, u] of await react.users.fetch()) {
					if (u.id == this.client.user.id) {
						botReacts ++;
						continue
					}
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
				if (!react.me) {
					reactWithoutBot ++;
					await roleMessage.react(react.emoji)
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
			\`${botReacts}\` valid reacts from the bot
			\`${memberWithoutRole}\` roles added to member who had reacted
			\`${leftMembers}\` reacts from users no longer in server removed
			\`${reactWithoutBot}\` reacts added by bot
			\`${reactWithoutRole}\` reacts without an associated role removed
			
			Wrong message found? Run the \`checkRoleMessage\` command for help.`,
		}})
	}
}


module.exports = FixReactsForRoleCommand;