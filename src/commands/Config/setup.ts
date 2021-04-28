import Command from '../../structures/Command';
import { Message, Util } from 'discord.js';
import Agness from '../../bot';
import { Settings } from '../../database/settings';

export default class SetupCommand extends Command {
    constructor(client: Agness, category: string) {
        super(client, {
            name: 'setup',
            category
        });
    }

    async run(message: Message, args: string[]): Promise<Message | void> {
        switch (args[0]?.toLowerCase() ?? '') {
            case 'muterole': {
                let model = await Settings.findOne({ guildID: message.guild!.id })
                let matchRole = args[1]?.match(/^<@&(\d+)>$/)?.[1] ?? args[1]
                if(model?.muteRoleID) matchRole = args[1]?.match(/^<@&(\d+)>$/)?.[1] ?? args[1]
                let role = matchRole ?
                    message.guild!.roles.cache.get(matchRole) :
                    (model && model.muteRoleID) ? 
                    message.guild!.roles.cache.get(model.muteRoleID)
                    ? message.guild!.roles.cache.get(model.muteRoleID) :
                    (await message.guild!.roles.create({
                        name: 'Muted',
                        color: '#616770',
                        mentionable: false
                    })) :
                    (await message.guild!.roles.create({
                        name: 'Muted',
                        color: '#616770',
                        mentionable: false
                    }))
                if (!role) return message.channel.send('Specified role or ID is invalid.')
                if (!role.editable) return message.channel.send('I cannot edit the specified ID or role.')
                const channels = (await message.guild!.channels.fetch()).array().filter(c => c.type === 'text')
                let msg: Message | void = await message.channel.send('I am preparing everything ... ')
                const toMute: string[] = []
                for (const channel of channels) {
                    try {
                        channel.overwritePermissions([
                            {
                                id: role.id,
                                deny: ['SEND_MESSAGES']
                            }
                        ])
                        toMute.push(`<:right:837100527816278017> **${channel.name}**`)
                        msg = await (msg as Message).edit(toMute.join('\n')).catch(async () => {
                            msg = await message.channel.send(toMute.join('\n'));
                        });
                    } catch (e) {
                        toMute.push(`<:error:837101355860230154> **${channel.name}**`)
                        msg = await (msg as Message).edit(toMute.join('\n')).catch(async () => {
                            msg = await message.channel.send(toMute.join('\n'));
                        });
                    }
                    await Util.delayFor(1000)
                }
                if (!model) model = new Settings({ guildID: message.guild!.id, muteRoleID: role.id })
                model.muteRoleID = role.id
                await model.save()
                message.channel.send(`Finish editing the role ${role}`, {
                    allowedMentions: {
                        roles: []
                    }
                })
                break;
            }
            case 'modrole': {
                let matchRole = args[1]?.match(/^<@&(\d+)>$/)?.[1] ?? args[1]
                let role = matchRole ?
                    message.guild!.roles.cache.get(matchRole) :
                    null
                if (!role) return message.channel.send('Specified role or ID is invalid.')
                let model = await Settings.findOne({ guildID: message.guild!.id })
                if (!model) model = new Settings({ guildID: message.guild!.id, modRoleID: role.id })
                model.modRoleID = role.id
                await model.save()
                message.channel.send(`Now the mod role is **${role}**`, {
                    allowedMentions: {
                        roles: []
                    }
                })
                break;
            }
            default: {
                return message.channel.send('Pon algo valido')
            }
        }
    }
}