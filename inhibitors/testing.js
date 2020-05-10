const { Inhibitor } = require('discord-akairo');

class testingInhibitor extends Inhibitor {
    constructor() {
        super(
            "testing",
            {
                reason: 'blacklist'
            }
        )
    }

    exec(message) {
        return (this.client.testMode == (message.guild.name != "Lonely Joe"))
    }
}

module.exports = testingInhibitor;