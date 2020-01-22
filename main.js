const { AkairoClient } = require("discord-akairo");
const Discord = require("discord.js");
const config = require("./config.js");

var token, prefix, testMode;
try {
	token = require("./token.json").key;
	console.log("Starting using locally stored value for token...");
	prefix = config.test_prefix;
	testMode = true;
}
catch(error) {
	token = process.env.TOKEN;
	console.log("Starting using token stored on Heroku...");
	prefix = config.main_prefix;
	testMode = false;
}

const client = new AkairoClient(
	{
	    ownerID: config.owner_id,
	    prefix: prefix,
	    commandDirectory: "./commands/",
	    listenerDirectory: "./listeners/"
	}
);

client.testMode = testMode;

client.login(token);