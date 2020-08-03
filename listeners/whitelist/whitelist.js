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
		if (message.channel.type != "dm" && this.client.testMode == (message.guild.name == "Lonely Joe")) {
			if (message.author.id != this.client.user.id && message.channel.name == "whitelist") {
				let whitelist = await message.channel.messages.fetch({ limit: 100 })
				whitelist = whitelist.filter(m => m.id != message.id)
				if (whitelist.filter(m => m.author.id == this.client.user.id).size > 0) {
					await message.delete({ reason: "Bot already dealing with another username whitelist request" })
				} else {
					let valid = false
					let deleteReason = ""
					let reply = await message.channel.send("Checking validity of username...")
					if (checkValid.test(message.content)) {
						await reply.edit("Looking for console channel...")
						let ch_console = message.guild.channels.cache.find(c => c.type == "text" && c.name == "server-console")
						if (ch_console) {
							await reply.edit("Searching whitelist for clashes...")
							let duplicate = whitelist.find(u => u.content == message.content)
							if (!duplicate) {
								await reply.edit("Searching whitelist for already whitelisted usernames...")
								let removed = []
								for (let [, m] of whitelist.filter(u => u.author.id == message.author.id)) {
									removed.push(m.content)
									await m.delete({ reason: "New username added by user" })
								}
								await reply.edit("Adding new username...")
								await ch_console.send(`whitelist add ${message.content}`)
								await reply.edit(removed.map(u => `Removed \`${u}\` from the whitelist\n`).join("") + `Added\`${message.content}\`to the whitelist`)
								valid = true
							} else {
								await reply.edit(`${duplicate.author} has already whitelisted \`${message.content}\`.`)
								deleteReason = "Duplicate username"
							}
						}
						else {
							await reply.edit("Couldn't find the console channel")
							deleteReason = "Couldn't find the console channel"
						}
					}
					else {
						await reply.edit(`\`${message.content}\` is not a valid username.`)
						deleteReason = "Invalid username"
					}
					if (!valid) {
						await message.delete({ reason: deleteReason })
					}
					return await reply.delete({ timeout: 5000 })
				}
			}
		}
	}
}

module.exports = WhitelistListener;