const { Command } = require("discord-akairo")
const { constructCommandInfo } = require("../../functions.js")
const checkValid = /^[0-9A-Za-z_]+$/
const whitelistListRegex = /^\[[A-Z][a-z]{2}, \d\d?. [A-Z][a-z]{2} \d{4} \d\d:\d\d:\d\d [A-Z]{3} INFO] There are \d* whitelisted players: [0-9A-Za-z_]+(, [0-9A-Za-z_]+)*$/

const commandInfo = constructCommandInfo(
	{
		id: "checkWhitelist",
		aliases: [],
		args: [{id: "messageLink", type: "string"}],
		description: {
			short: "Gives role to every meeber who has reacted but does not have role",
			extend: "Also removes reacts from users no longer in the server",
		},
		userPermissions: ["MANAGE_ROLES", "MANAGE_MESSAGES"]
	},
	__dirname
)

class CheckWhitelistCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	async exec(message, args) {
		let chWhitelist = message.guild.channels.cache.find(c => c.name == "whitelist")
		let chConsole = message.guild.channels.cache.find(c => c.name == "server-console")
		let whitelistValid = []
		let whitelistInvalid = []

		chConsole.send("whitelist list")
		let whitelist = await chConsole.awaitMessages(m => whitelistListRegex.test(m.content), {max: 1, time: 10000})
		let whitelistFound;
		if (whitelist.size > 0) {
			whitelist = whitelist.array()[0].content.split(", ")
			whitelist.shift()
			whitelist[0] = whitelist[0].split(": ").pop()
			whitelistFound = true
		} else {
			whitelistFound = false
		}

		for (let [, message] of await chWhitelist.messages.fetch({limit: 100})) {
			if (checkValid.test(message.content)) {
				if (!whitelistValid.map(a => a.userID).includes(message.author.id)) {
					if (!whitelistValid.map(a => a.username).includes(message.content)) {
						let index;
						if (whitelistFound) {
							index = whitelist.indexOf(message.content)
						}
						if (!whitelistFound || index >= 0) {
							whitelistValid.push({
								userID: message.author.id,
								username: message.content,
								messageURL: message.url
							})
							if (whitelistFound) {
								whitelist.splice(index, 1)
							}
						} else {
							whitelistInvalid.push({
								userID: message.author.id,
								username: message.content,
								messageURL: message.url,
								reason: "Username not on server whitelist"
							})
						}
					} else {
						whitelistInvalid.push({
							userID: message.author.id,
							username: message.content,
							messageURL: message.url,
							reason: "Duplicate username"
						})
					}
				} else {
					whitelistInvalid.push({
						userID: message.author.id,
						username: message.content,
						messageURL: message.url,
						reason: "Duplicate user"
					})
				}
			} else {
				whitelistInvalid.push({
					userID: message.author.id,
					username: message.content,
					messageURL: message.url,
					reason: "Invalid username"
				})
			}
		}

		await message.channel.send({embed: {
			title: "Whitelist Check Results",
			description: `Valid usernames: ${whitelistValid.length}\nInvalid usernames: ${whitelistInvalid.length}`,
		}})

		await message.channel.send({embed: {
			title: "Valid usernames",
			fields: [
				{
					name: "Users",
					value: whitelistValid.map(a => `<@${a.userID}>`),
					inline: true
				}, {
					name: "Usernames",
					value: whitelistValid.map(a => `[${a.username}](${a.messageURL})`),
					inline: true
				}
			]
		}})
		await message.channel.send({embed: {
			title: "Invalid usernames",
			fields: [
				{
					name: "Users",
					value: whitelistInvalid.map(a => `<@${a.userID}>`),
					inline: true
				}, {
					name: "Usernames",
					value: whitelistInvalid.map(a => `[${a.username}](${a.messageURL})`),
					inline: true
				}, {
					name: "Reasons why invalid",
					value: whitelistInvalid.map(a => a.reason),
					inline: true
				}
			]
		}})
	}
}


module.exports = CheckWhitelistCommand;