import { Message, MessageEmbed } from 'discord.js';
import { Settings } from '../../database/settings';
import { Automods } from '../../database/automod';
import Command from '../../structures/Command';
import ms = require('@fabricio-191/ms')
import Agness from '../../bot';

export default class SettingsCommand extends Command {
    constructor(client: Agness, category: string) {
        super(client, {
            name: 'settings',
            category
        });
    }

    async run(message: Message): Promise<Message> {
        const settings = await Settings.findOne({ guildID: message.guild!.id })
        const automod = await Automods.findOne({ guildID: message.guild!.id })

        return message.channel.send(`> **Settings of ${message.guild!.name} server**`, new MessageEmbed()
            .addField('📊 Server Settings', `**Prefix:** \`${this.prefix}\`
**Mod role:** ${settings?.modRoleID ? `<@&${settings!.modRoleID}>` : '`none`'}
**Mute role:** ${settings?.muteRoleID ? `<@&${settings!.muteRoleID}>` : '`none`'}
**Mod logs:** ${settings?.modLogs ? `<#${settings!.modLogs}>` : '`none`'}`, true)
            .addField('🚩 Punishments', `${automod?.punishments.length ? automod.punishments.sort((a, b) => a.cases - b.cases).map((item) => {
                const emojis: {
                    [x: string]: string
                } = {
                    mute: '🤐',
                    tempmute: '🤐',
                    kick: '👢',
                    ban: '🔨',
                    tempban: '🕐',
                    softban: '🛡️'
                }
                return `\`🚩[${item.cases}]\` - ${item.TYPE} ${emojis[item.TYPE]} ${item.time ? `- ${ms(item.time, { length: 1 })}` : ''}`
            }).join('\n') : 'No punishments'}`, true)
            .addField('🛡️ AutoMod Settings', `__Messages__

Spam ${(automod?.messageSpam?.cases && automod?.messageSpam?.messages && automod?.messageSpam?.seconds) ? `\`${automod.messageSpam.messages}\`messages/\`${automod?.messageSpam?.seconds}\`s (\`${automod.messageSpam.cases}🚩\`)` : '`disabled`'}
Anti duplicate: ${automod?.antiDuplicateMessage ? `\`${automod.antiDuplicateMessage}🚩\`` : '`disabled`'}
Anti invites: ${automod?.antiInvites?.cases ? `\`${automod.antiInvites.cases}🚩\`` : '`disabled`'}
Anti zalgo: ${automod?.antiZalgo ? `\`${automod?.antiZalgo}🚩\`` : '`disabled`'}
Max capital letters ${(automod?.antiMassCaps?.cases && automod?.antiMassCaps?.amount) ? `\`${automod.antiMassCaps.amount}\` uppercase (\`${automod.antiMassCaps.cases}🚩\`)` : '`disabled`'}
Max attachment: ${(automod?.antiMassAttachments?.amount && automod?.antiMassAttachments?.cases) ? `\`${automod.antiMassAttachments.amount}\` att (\`${automod.antiMassAttachments.cases}🚩\`)` : '`disabled`'}
Max emojis: ${(automod?.antiMassEmojis?.amount && automod?.antiMassEmojis?.cases) ? `\`${automod.antiMassEmojis.amount}\` emojis (\`${automod.antiMassEmojis.cases}🚩\`)` : '`disabled`'}
Max spoiler: ${(automod?.antiMassSpoilers?.amount && automod?.antiMassSpoilers?.cases) ? `\`${automod.antiMassSpoilers.amount}\` spoilers (\`${automod.antiMassSpoilers.cases}🚩\`)` : '`disabled`'}
Max Characters:  ${(automod?.antiMaxCharacters?.amount && automod?.antiMaxCharacters?.cases) ? `\`${automod.antiMaxCharacters.amount}\` length (\`${automod.antiMaxCharacters.cases}🚩\`)` : '`disabled`'}

__Others__

Anti raid: ${(automod?.antiRaid?.joins && automod?.antiRaid?.seconds) ? `\`${automod?.antiRaid?.joins}\`joins/\`${automod?.antiRaid?.seconds}\`s` : '`disabled`'}
Ignore users ${automod?.usersIgnored.length ? automod.usersIgnored.map(x => `<@${x}>`).join(', ') : '`none`'}
Ignore roles ${automod?.rolesIgnored.length ? automod.rolesIgnored.filter(roleID => !!message.guild?.roles.cache.has(roleID)).map(x => `<@&${x}>`).join(', ') : '`none`'}`, true))
    }
}