const { Command } = require('discord-akairo');
const Discord = require('discord.js')
const moment = require('moment')


const commandInfo = {
    id: "serverInfo",
    aliases: [],
    args: [],
    description: {
        short: "Views the information about the server.",
        extend: ""
    }
}

commandInfo.aliases.unshift(commandInfo.id)
commandInfo.description.long = commandInfo.description.short + "\n" + commandInfo.description.extend
commandInfo.description.args = commandInfo.args.map(item => item.id)

class ServerInfoCommand extends Command {
    constructor() {
        super(
            commandInfo.id,
            commandInfo
        );
    }
    async exec(message) {
        const guildInfo = await message.guild

        //Calculating Member numbers.
        const guildMembers = await guildInfo.members.fetch()

        const membersSize = guildMembers.size;
        const botsSize = guildMembers.filter(b => b.user.bot).size
        const humanSize = membersSize - botsSize
        const onlineSize = guildMembers.filter(u => u.presence.status === 'online').size
        const guildOwner = message.guild.owner.user
        const guildCreatedDate = new moment(message.guild.createdAt).format('DD MMM YYYY')

        //Region
        const guildRegion = message.guild.region

        //Channels
        const guildChannels = guildInfo.channels.cache 

        const textChannelSize = guildChannels.filter(c => c.type === 'text').size
        const voiceChannelSize = guildChannels.filter(c => c.type === 'voice').size
        const categoriesSize = guildChannels.filter(c => c.type === 'category').size

        //Emojis
        const eomjiSize = guildInfo.emojis.size

        //Roles
        const roleSize = guildInfo.roles.size

        //Verified
        let isVerified = ''
            if(message.guild.verified) {
                isVerified = 'Yes'
            } else {
                isVerified = 'No'
            }
       
        //Embed
        message.channel.send({embed: {
            author: message.guild.name,
            thumbnail: {
                url: message.guild.iconURL()
            },
            color: 16426522,
            footer: `ID: ${message.guild.id}`,
            fields: [
                {
                    name: 'Owner',
                    value: guildOwner,
                    inline: true,
                }, {
                    name: "Region",
                    value: guildRegion,
                    inline: true
                }, {
                    name: "Members",
                    value: membersSize,
                    inline: true
                }, {
                    name: "Online",
                    value: onlineSize,
                    inline: true
                }, {
                    name: "Humans",
                    value: humanSize,
                    inline: true
                }, {
                    name: "Bots",
                    value: botsSize,
                    inline: true
                }, {
                    name: "Channel Categories",
                    value: categoriesSize,
                    inline: true
                }, {
                    name: "Text Channels",
                    value: textChannelSize,
                    inline: true
                }, {
                    name: "Voice Channels",
                    value: voiceChannelSize,
                    inline: true
                }, {
                    name: "Emojis",
                    value: eomjiSize,
                    inline: true
                }, {
                    name: "Roles",
                    value: roleSize,
                    inline: true
                }, {
                    name: "Verified",
                    value: isVerified,
                    inline: true
                }, {
                    name: "Created",
                    value: guildCreatedDate,
                    inline: true
                }
            ]
        }})
    }
}

module.exports = ServerInfoCommand;