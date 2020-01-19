const { Command } = require("discord-akairo");
const Discord = require("discord.js");

class WhitelistCommand extends Command {
	constructor() {
		super(
			"whitelist",
			{
				aliases: ["whitelist"],
				args: [{id: "nickname", type: "string"}],
				description: "Add a nickname to the Minecraft whitelist.\nOnly one nickname allowed per person. You must have the Minecraft role to add a nickname - removing the role will also remove your nickname."
			}
		)
	}
	async exec(message, args) {
		let whitelist_channel, console_channel;
		message.guild.channels.forEach(async function(channel) {
			if (channel.name == "minecraft-info") {
				whitelist_channel = channel;
			} else if (channel.name == "server-console") {
				console_channel = channel;
			}
		});
		let has_role = false
			message.member.roles.forEach(function(role) {
				if (role.name == "Minecraft") {
					has_role = true
				}
			});

		if (!has_role) {
			message.reply("Sorry, you need the Minecraft role to do that.")
		} else {
			let bot_id = this.client.user.id;
			if (whitelist_channel && console_channel) {
				let messages = await whitelist_channel.fetchMessages(10);
				messages.forEach(function(msg) {
					if (msg.author.id == bot_id) {
						msg.embeds.forEach(function(embed) {
							if (embed.type == "rich") {
								let fields = embed.fields;
								if (fields[0].name == "Whitelist") {
									let people, names;
									if (fields[1].name == "Person") {
										people = fields[1].value.split("\n");
										if (fields[2].name == "Nickname") {
											names = fields[2].value.split("\n");

											let replace;
											for (let i = 0; i < people.length; i++) {
												if (`<@${message.author.id}>` == people[i]) {
													replace = i;
												}
											}

											let reply = "";
											if (replace != null) {
												console_channel.send(`whitelist remove ${names[replace]}`);
												reply += `The nickname **${names[replace]}** was removed from the whitelist.\n`;
												names.splice(replace, 1);
												people.splice(replace, 1);
												}
											people.push(`<@${message.author.id}>`);
											names.push(args.nickname);
											console_channel.send(`whitelist add ${args.nickname}`);
											reply += `The nickname **${args.nickname}** was added to the whitelist.`;
											message.reply(reply)

											msg.edit(
												new Discord.RichEmbed()
												.setColor(embed.color)
												.addField("Whitelist", "Type `/whitelist [nickname]` to add a name to the list.\nOnly one nickname is allowed per person.)")
												.addField("Person", people.join("\n"), true)
												.addField("Nickname", names.join("\n"), true)
											);
										}
									}
								}
							}
						});
					}
				});
			}
		}
	}
}

module.exports = WhitelistCommand;