const { Command } = require("discord-akairo")
const moment = require("moment")
const { constructCommandInfo } = require("../../functions.js")

const commandInfo = constructCommandInfo(
    {
        id: "infoRole",
        aliases: ["roleInfo"],
        args: [{id: "role", type: "role"}],
        description: {
            short: "Shows information about the given role.",
            extend: ""
        }
    },
    __dirname
)

class InfoRoleCommand extends Command {
    constructor() {
        super(
            commandInfo.id,
            commandInfo
        );
    }

    async exec(message, args) {
        if (args.role && args.role.name != "@everyone") {
            const createdDate = new moment(args.role.createdAt)
            let membersInfo = ""
            for (let [, member] of args.role.members.sort((m1, m2) => m2.roles.cache.reduce((t, r) => t + r.rawPosition) - m1.roles.cache.reduce((t, r) => t + r.rawPosition))) {
                const newMemberString = member.toString()
                if (membersInfo.length + newMemberString.length < 1024) {
                    membersInfo += "\n" + newMemberString
                } else {
                    break
                }
            }

            return message.channel.send({ embed: {
                color: args.role.color,
                footer: {
                    text: `ID: ${args.role.id}`
                },
                fields: [
                    {
                        name: "Role",
                        value: args.role,
                        inline: true
                    }, {
                        name: "Created on",
                        value: createdDate.format("DD MMM YYYY"),
                        inline: true
                    }, {
                        name: "Position",
                        value: args.role.rawPosition,
                        inline: true
                    }, {
                    name: `Members with this role: ${args.role.members.size}`,
                    value: membersInfo
                    }
                ]
            }})
        }
    }
}

module.exports = InfoRoleCommand
