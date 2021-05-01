import { Automods } from '../../database/automod';
import Command from '../../structures/Command';
import ms = require('@fabricio-191/ms')
import { Message } from 'discord.js';
import Agness from '../../bot';

export default class PunishmentsCommand extends Command {
    constructor(client: Agness, category: string) {
        super(client, {
            name: 'punishments',
            aliases: ['punishment', 'penalty'],
            memberGuildPermissions: ['MANAGE_GUILD'],
            category
        });
    }

    async run(message: Message, args: string[]): Promise<any> {
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
        let automod = await Automods.findOne({ guildID: message.guild!.id })
        if (!automod) automod = new Automods({
            guildID: message.guild!.id,
            punishments: [],
            antiInvites: {
                whiteList: [],
                cases: 0
            },
            antiZalgo: 0,
            messageSpam: {
                messages: 0,
                seconds: 0,
                cases: 0
            },
            antiDuplicateMessage: 0,
            antiMassCaps: {
                amount: 0,
                cases: 0
            },
            antiMassSpoilers: {
                amount: 0,
                cases: 0
            },
            antiMassAttachments: {
                amount: 0,
                cases: 0
            },
            antiMassEmojis: {
                amount: 0,
                cases: 0
            },
            antiMaxCharacters: {
                amount: 0,
                cases: 0
            },
            antiRaid: {
                joins: 0,
                seconds: 0
            },
            usersIgnored: [],
            rolesIgnored: []
        })
        const find = automod!.punishments.find(item => item.cases == parseInt(args[1]))
        const index = automod!.punishments.findIndex(item => item.cases == find?.cases) || 0;
        switch (args[0]?.toLowerCase() ?? '') {
            case 'delete': {

                if (index == -1) return message.channel.send(`It is not a valid punishment, look at the punishments using: \`${this.prefix}settings\``);

                automod?.punishments.splice(index, 1);

                await automod?.save();

                message.channel.send('Punishment removed correctly.');
                break;
            }
            default: {

                if (!Object.keys(emojis).includes(args[0]))
                    return message.channel.send(`If you want to edit or add a punishment you must use:
> \`${this.prefix}punishments mute [strikes]\`
> \`${this.prefix}punishments kick [strikes]\`
> \`${this.prefix}punishments ban [strikes]\`
> \`${this.prefix}punishments softban [strikes] [time]\`
> \`${this.prefix}punishments tempmute [strikes] [time]\`
> \`${this.prefix}punishments tempban [strikes] [time]\`

If you want to remove a punishment use:
> \`${this.prefix}punishments delete [strikes]\``);

                const mss = ms(args[2], { languages: 'all' });
                const temp = ['tempban', 'tempmute'].includes(args[0])
                if (!mss && temp) return message.channel.send('You must specify the amount of time.');
                if (!parseInt(args[1])) return message.channel.send('Strikes must be a number.');
                if (parseInt(args[1]) > 30) return message.channel.send('Strikes must not exceed 30.');
                if (temp && mss < 60 * 1000) return message.channel.send('The time must be greater than 1 minute.');
                if (mss > 63115200000) return message.channel.send('The time must be less than 2 years.');

                let replace = {
                    TYPE: (args[0] as 'mute' | 'tempmute' | 'kick' | 'ban' | 'tempban' | 'softban'),
                    cases: parseInt(args[1]),
                    time: temp ? mss : 0
                }
                automod!.punishments.push(replace);
                if (find) automod!.punishments.splice(index, 1);

                await automod!.save();

                message.channel.send('Punishment edited/added correctly.');
                break;
            }
        }
    }
}