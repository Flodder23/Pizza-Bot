const { Command } = require("discord-akairo");
const Discord = require("discord.js")
const moment = require("moment")


const commandInfo = {
	id: "infoServer",
	aliases: ["serverInfo"],
	args: [],
	description: {
		short: "Shows information about the server.",
		extend: ""
	}
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)
commandInfo.category = __dirname.split("\\").pop()

class InfoServerCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}
	async exec(message) {
		const guild = message.guild
		const guildMembers = await guild.members.fetch()
		const membersSize = guildMembers.size;
		const botsSize = guildMembers.filter(b => b.user.bot).size

		message.channel.send({embed: {
			author: {
				name: guild.name + " info",
				icon_url: guild.iconURL()
			},
			color: 16426522,
			footer: `ID: ${guild.id}`,
			fields: [
				{
					name: "Owner",
					value: guild.owner.user,
					inline: true,
				}, {
					name: "Region",
					value: guild.region,
					inline: true
				}, {
					name: "Members",
					value: membersSize,
					inline: true
				}, {
					name: "Online",
					value: guildMembers.filter(u => u.presence.status === "online").size,
					inline: true
				}, {
					name: "Humans",
					value: membersSize - botsSize,
					inline: true
				}, {
					name: "Bots",
					value: botsSize,
					inline: true
				}, {
					name: "Channel Categories",
					value: guild.channels.cache.filter(c => c.type === "category").size,
					inline: true
				}, {
					name: "Text Channels",
					value: guild.channels.cache.filter(c => c.type === "text").size,
					inline: true
				}, {
					name: "Voice Channels",
					value: guild.channels.cache.filter(c => c.type === "voice").size,
					inline: true
				}, {
					name: "Emojis",
					value: guild.emojis.cache.array().length,
					inline: true
				}, {
					name: "Roles",
					value: guild.roles.cache.array().length,
					inline: true
				}, {
					name: "Created",
					value: new moment(guild.createdAt).format("DD MMM YYYY"),
					inline: true
				}
			]
		}})
	}
}

module.exports = InfoServerCommand;