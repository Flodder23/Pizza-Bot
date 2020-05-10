const { Command } = require("discord-akairo");

const commandInfo = {
	id: "rps",
	aliases: ["rockpaperscissors"],
	args: [{id: "choice", type: "string"}],
	description: {
		short: "Play Rock Paper Scissors.",
		extend: "Replies with its choice and says who, if anyone, won.",
	}
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class rpsCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	exec(message, args) {
		let player_choice = args.choice.toLowerCase();
		if (!["rock", "paper", "scissors"].includes(player_choice)) {
			return message.reply("Please make a legit choice (rock, paper or scissors)")
		}
		
		const bot_choice = ["rock", "paper", "scissors"][Math.floor(3 * Math.random())];
		let reply = `you chose ${player_choice}.\nI chose ${bot_choice}.\n`;

		if (bot_choice === player_choice) {
			reply += "It's a draw!";
		}
		else if (player_choice === "rock") {
			if (bot_choice === "paper"){
				reply += "I";
			}
			else {
				reply += "You";
			}
		}
		else if (player_choice === "paper") {
			if (bot_choice === "rock") {
				reply += "You";
			}
			else {
				reply += "I";
			}
		}
		else {
			if (bot_choice === "rock") {
				reply += "I";
			}
			else {
				reply += "You";
			}
		}
		if (!(bot_choice === player_choice)) {
			reply += " win!";
		}
		return message.reply(reply);
	}
}

module.exports = rpsCommand;