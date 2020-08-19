const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require("discord-akairo");
const config = require("./config.js");

let token, testMode, prefix;
try {
	token = require("./token.json").key;
	console.log("Starting using locally stored value for token...");
	prefix = config.testPrefix
	testMode = true;
}
catch(error) {
	token = process.env.TOKEN;
	console.log("Starting using token stored on Heroku...");
	prefix = config.prefix
	testMode = false;
}

class MyClient extends AkairoClient {
	constructor() {
		super({
			ownerID: config.owner_id
		});

		this.commandHandler = new CommandHandler(
			this,
			{
				directory: "./commands/",
				prefix: prefix,
				allowMention: true
			}
		);
		this.inhibitorHandler = new InhibitorHandler(this, { directory: "./inhibitors/" });
		this.listenerHandler = new ListenerHandler(this, { directory: "./listeners/" });

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

		this.listenerHandler.setEmitters({ commandHandler: this.commandHandler })
		
		this.commandHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();
	}
}

const client = new MyClient();

client.testMode = testMode;

client.login(token);