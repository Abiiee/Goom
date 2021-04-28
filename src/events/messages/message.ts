  
import { Message, MessageAttachment, TextChannel } from 'discord.js-light';
import { Servers } from '../../database/server';
import Event from '../../structures/Event';
import Agness from '../../bot';

export default class MessageEvent extends Event {
    constructor(client: Agness) {
        super(client, {
            name: 'message'
        });
    }

    async run(message: Message): Promise<void> {
        if (!message.author || message.author.bot) return;

        let server = await Servers.findOne({ guildID: message.guild?.id });
        if (message.guild && !server)
            server = await Servers.create({ guildID: message.guild.id });

        const prefix = server?.prefix ?? process.env.BOT_PREFIX;
        const prefixes = [prefix, `<@${this.client.user!.id}>`, `<@!${this.client.user!.id}>`];
        const usedPrefix = prefixes.find((p) => message.content.startsWith(p));
        if (!usedPrefix) return;
        if (usedPrefix != prefix)
            message.mentions.users.delete(message.mentions.users.first()!.id);

        const args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
        const command = args.shift()?.toLowerCase();

        const cmd = this.client.commands.get(command);

        try {
            if (!cmd) return;
            cmd.prepare(prefix);
            if (!(await cmd.canRun(message))) return;
            await cmd.run(message, args);
        } catch (e) {
            console.log(e.stack ?? e);
            message.channel.send(`An unexpected error has occurred, here's a small reference: ${e.message ?? e}`);
        }
    }
}