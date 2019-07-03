const { Listener } = require("discord-akairo");
const Discord = require("discord.js");

class WhitelistRemoveOnLeave extends Listener {
	constructor() {
		super(
			"WhitelistRemoveOnLeave",
			{
				emitter: "client",
				eventName: "guildMemberRemove"
			}
		);
	}

	async exec(member) {
		let bot_id = this.client.user.id;
		let whitelist_channel, console_channel;
		member.guild.channels.forEach(async function(channel) {
			if (channel.name == "minecraft-info") {
				whitelist_channel = channel;
			} else if (channel.name == "server-console") {
				console_channel = channel;
			}
		});

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

										let remove;
										for (let i = 0; i < people.length; i++) {
											if (`<@${member.id}>` == people[i]) {
												remove = i;
											}
										}

										if (remove != null) {
											console_channel.send(`whitelist remove ${names[remove]}`);
											names.splice(remove, 1);
											people.splice(remove, 1);

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
						}
					});
				}
			});
		}
	}
}

module.exports = WhitelistRemoveOnLeave;