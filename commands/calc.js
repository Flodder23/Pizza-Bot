const { Command } = require("discord-akairo");
const WolframAlphaAPI = require('wolfram-alpha-api');
let waKey;
try {
	waKey = require("../waKey.json").key;
	console.log("Using locally stored Wolfram|Alpha token");
}
catch(error) {
	waKey = process.env.WATOKEN;
	console.log("Starting using Wolfram|Alpha token stored on Heroku...");
}
const waApi = WolframAlphaAPI(waKey);
const Discord = require("discord.js");

const commandInfo = {
	id: "calc",
	aliases: ["calculate", "wolfram"],
	args: [{id: "calculation", type: "string", default: "", match: "content"}],
	description: {
		short: "Ask a yes/no question.",
		extend: "",
	}
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class CalcCommand extends Command {
	constructor() {
		super(
			commandInfo.id,
			commandInfo
		);
	}

	async exec(message, args) {
		let answer = await waApi.getFull(args.calculation);
		if (answer.success) {
			for (let pod of answer.pods) {
				if (!pod.error) {
					let firstSubpod = true
					for (let subpod of pod.subpods) {
						await message.channel.send(
							`${firstSubpod ? `**${pod.title}**` : ""}\n\`${subpod.plaintext}\``,
							{
								embed: {
									image: {
										url: subpod.img.src
									}
								}
							}
						);
						firstSubpod = false
					}
				}
			}
		}
	}
}

module.exports = CalcCommand;
