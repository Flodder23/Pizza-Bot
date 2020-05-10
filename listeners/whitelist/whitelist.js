const { Listener } = require("discord-akairo");
const checkValid = /^[0-9A-Za-z_]+$/

class WhitelistListener extends Listener {
	constructor() {
		super(
			"whitelist",
			{
				emitter: "client",
				event: "message"
			}
		);
	}

	async exec(message) {
		if (this.client.testMode == (message.channel.type == "dm" || message.guild.name == "Lonely Joe")) {
			if (message.author.id != this.client.user.id && message.channel.name == "whitelist") {
				let ch_whitelist = message.channel;
				let valid = true;
				let messages = await ch_whitelist.messages.fetch({ limit: 100 });
				for (let m of messages) {
					if (m[1].author.id == this.client.user.id) {
						await message.delete();
						valid = false;
						break
					}
				}
				if (valid) {
					let reply = await message.channel.send("Checking validity of username...")
					if (checkValid.test(message.content)) {
						await reply.edit("Looking for console channel...")
						let ch_console;
						for (let ch of message.guild.channels.cache) {
							if (ch[1].type == "text" && ch[1].name == "server-console") {
								ch_console = ch[1];
								break
							}
						}
						if (typeof ch_console == "undefined") {
							await reply.edit("Couldn't find the console channel");
							valid = false
						}
						else {
							await reply.edit("Searching whitelist for clashes...");
							let to_remove;
							for (let m of messages) {
								if (m[1].id != message.id) {
									if (m[1].content == message.content) {
										reply.edit(`${m[1].author.toString()} has already whitelisted \`${message.content}\`.`);
										valid = false
										break
									} else {
										if (m[1].author.id == message.author.id) {
											to_remove = m[1];
										}
									}
								}
							}
							if (valid) {
								if (typeof to_remove != "undefined") {
									await reply.edit("Removing old username...");
									await ch_console.send(`whitelist remove ${to_remove.content}`);
									await to_remove.delete();
								}
								await reply.edit("Adding new username...");
								await ch_console.send(`whitelist add ${message.content}`);
								if (typeof to_remove == "undefined") {
									await reply.edit(`Added \`${message.content}\` to the whitelist.`);
								} else {
									await reply.edit(`Removed \`${to_remove.content}\` from the whitelist.\nAdded \`${message.content}\` to the whitelist.`)
								}
							}
						}
					}
					else {
						await reply.edit(`\`${message.content}\` is not a valid username.`)
						valid = false;
					}
					if (!valid) {
						await message.delete();
					}
					await reply.delete({timeout: 5000});
				}
			}
		}
	}
}

module.exports = WhitelistListener;