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
        return !(message.channel.type == "dm" || this.client.testMode == (message.guild.id == "394948324999954432"))
    }
}

// module.exports = testingSeperatorInhibitor;