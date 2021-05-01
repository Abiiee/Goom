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
import Command from '../../structures/Command';
import { Message, MessageEmbed } from 'discord.js';
import Agness from '../../bot';
import { Automods } from '../../database/automod';
import ms = require('@fabricio-191/ms')

export default class PunishmentsCommand extends Command {
    constructor(client: Agness, category: string) {
        super(client, {
            name: 'punishments',
            category
        });
    }

    async run(message: Message, args: string[]): Promise<any> {

        const automod = await Automods.findOne({ guildID: message.guild!.id }),
            find = automod?.punishments.find(item => item.cases == parseInt(args[1])),
            index = automod?.punishments.findIndex(item => item.cases == find?.cases) || 0;

        if (args[0] == 'delete') {

            if (index == -1) return message.channel.send('invalid case');

            automod?.punishments.splice(index, 1);

            await automod?.save();

            return message.channel.send('deleted');

        }

        else {

            if (!Object.keys(emojis).includes(args[0]))
                return message.channel.send(`Invlaid type, chos betuin: ${Object.keys(emojis).join(', ')}\n\n>>${this.name} <(${Object.keys(emojis).join('|')})> <cases> [time=0]`);

            if (find) {

                const mss = ms(args[2], { languages: 'all' });

                if (!mss && ['tempban', 'tempmute'].includes(args[0])) return message.channel.send('invalid timexddx');
                if (!parseInt(args[1])) return message.channel.send('invalid cases');
                if (parseInt(args[1]) > 20) return message.channel.send('menos de 20 pa :pensive:');
                if (mss <= 60 * 1000) return message.channel.send('time must have nose, un minuto');
                if (mss > 63115200000) return message.channel.send('time, nose, menor a dos años');

                automod?.punishments.push({
                    TYPE: (args[0] as 'mute'),
                    cases: parseInt(args[1]),
                    time: ['tempban', 'tempmute'].includes(args[0]) ? mss : 0
                });

                automod?.punishments.splice(index, 1);

                await automod?.save();

                return message.channel.send('edited');

            }

            else {

                const mss = ms(args[2], { languages: 'all' });

                if (!mss && ['tempban', 'tempmute'].includes(args[0])) return message.channel.send('invalid timexddx');
                if (!parseInt(args[1])) return message.channel.send('invalid cases');
                if (parseInt(args[1]) > 20) return message.channel.send('menos de 20 pa :pensive:');
                if (mss <= 60 * 1000) return message.channel.send('time must have nose, un minuto');
                if (mss > 63115200000) return message.channel.send('time, nose, menor a dos años');

                automod?.punishments.push({
                    TYPE: (args[0] as 'mute'),
                    cases: parseInt(args[1]),
                    time: ['tempban', 'tempmute'].includes(args[0]) ? mss : 0
                });

                await automod?.save();

                return message.channel.send('added');

            }
        }
    }
}