const { Inhibitor } = require('discord-akairo');

class testingSeperatorInhibitor extends Inhibitor {
    constructor() {
        super(
            "testingSeperator",
            {
                reason: "blacklist",
                type: "all"
            }
        )
    }

    exec(message) {
        return !(message.channel.type == "dm" || this.client.testMode == (message.guild.name == "Lonely Joe"))
    }
}

module.exports = testingSeperatorInhibitor;