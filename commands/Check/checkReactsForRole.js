const { Command } = require("discord-akairo")
const { constructCommandInfo, getRoleMessage } = require("../../functions.js")

const commandInfo = constructCommandInfo(
	{
		id: "checkReactsForRole",
		aliases: [],
		args: [{id: "messageLink", type: "string"}],
		description: {
			short: "Checks that all reacts on the given roles message are from users with the corresponding role.",
			extend: "If no link to a message is given, the bot will try to find it itself.",
		}
	},
	__dirname
)

class CheckReactsForRoleCommand extends Command {
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
						}
					} else {
						leftMembers ++;
					}
				}
				if (!react.me) {
					reactWithoutBot ++;
				}
			} else {
				reactWithoutRole ++;
			}
		}
		return await message.channel.send({ embed: {
			title: "checkReactsForRole results",
			description:`Checked [this message](${roleMessage.url})
			\`${valid}\` valid reacts
			\`${botReacts}\` valid reacts from the bot
			\`${memberWithoutRole}\` reacts are from users who don't have the associated role
			\`${leftMembers}\` reactions are from users who are no longer in the server
			\`${reactWithoutBot}\` are valid reactions that the bot hasn't reacted with
			\`${reactWithoutRole}\` reacts don't have an associated role
			
			Wrong message found? Run the \`checkRoleMessage\` command for help.`,
		}})
	}
}


module.exports = CheckReactsForRoleCommand;