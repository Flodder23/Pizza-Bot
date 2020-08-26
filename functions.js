module.exports = {
	constructCommandInfo: function (info, dir) {
		info.aliases.unshift(info.id)
		info.description.long = info.description.short + "\n" + info.description.extend
		info.description.args = info.args.map(item => item.id)
		if (dir.includes("/")) {
			info.category = dir.split("/").pop()
		} else {
			info.category = dir.split("\\").pop()
		}
		return info
	},
	getPing: function (str, guild) {
		if (str.match(/^<@(&|!?)\d{17,19}>$/)) {  // if it's already a ping
			return str
		}
		if (str.match(/^@?((h(ere)?)|(e(veryone)?))$/i)) {
			if (str.includes("h")) {
				return "@here"
			} else {
				return "@everyone"
			}
		}
		if (!guild) {return null}
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
	},
	isRolesMessage: function (message, clientID) {
		return (message.content.startsWith("**ROLES**") && message.channel.name == "server-info" && message.author.id == clientID)
	},
	linkToMessage: function (link, guild) {
		link = link.split("/")
		if (link.length < 3) {
			return "Invalid link."
		}
		let [guildID, channelID, messageID] = link.slice(start=link.length - 3)
		if (guildID == guild.id) {
			let channel = guild.channels.resolve(channelID)
			if (channel) {
				let message = channel.messages.resolve(messageID)
				if (message) {
					return message
				} else {
					return "Message not found."
				}
			} else {
				return "Channel not found."
			}
		} else {
			return "Server ID does not match."
		}
	},
	checkRoleMessage: function(message, botID) {
		let output = []
		if (message.author.id != botID) {
			output.push("Message not sent by this bot - to get bot to send a message, use the `echo` command.")
		}
		if (message.channel.name != "server-info") {
			output.push("Message must be in channel called `server-info`.")
		}
		if (!message.content.startsWith("**ROLES**")) {
			output.push("Message must start with \"**ROLES**\" (to get bold effect, type `**ROLES**`)")
		}
		if (output.length == 0) {
			return "Roles message is valid."
		} else {
			return output.join("\n")
		}
	},
	getRoleMessage: function(guild, botID, stopAtFirst=true) {
		let channels = guild.channels.cache.filter(c => c.name == "server-info" && c.type == "text")
		if (channels.size == 0) {
			return "Could not find channel named `server-info`."
		}
		if (stopAtFirst) {
			for (let [, c] of channels) {
				let roleMessage = c.messages.cache.find(m => m.author.id == botID && m.content.startsWith("**ROLES**"))
				if (roleMessage) {
					return roleMessage
				}
			}
			return "Couldn't find role message. Use the `checkRoleMessage` command for more info."
		} else {
			let roleMessages = []
			for (let [, c] of channels) {
				roleMessages.push(...c.messages.cache.filter(m => m.author.id == botID && m.content.startsWith("**ROLES**")).array())
			}
			return roleMessages
		}
	}
}
