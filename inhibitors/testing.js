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
        return (this.client.testMode != (message.channel.type == "dm" || message.guild.name == "Lonely Joe"))
    }
}

module.exports = testingSeperatorInhibitor;