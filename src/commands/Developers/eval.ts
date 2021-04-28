import Command from '../../structures/Command';
import { promisify, inspect } from 'util';
import { exec } from 'child_process';
import { Message } from 'discord.js';
import Agness from '../../bot';

export default class EvalCommand extends Command {
    constructor(client: Agness, category: string) {
        super(client, {
            name: 'eval',
            aliases: ['e'],
            usageArgs: ['<Code | Type>'],
            devsOnly: true,
            guildOnly: false,
            category
        });
    }

    async run(message: Message, args: string[]): Promise<Message> {
        let evalued = 'undefined';
        switch (args[0]?.toLowerCase() ?? '') {
            case '-a': {
                if (!args[1]) return message.channel.send('What do you wanna evaluate?');
                try {
                    evalued = await eval('(async() => {\n' + args.slice(1).join(' ') + '\n})();');
                    evalued = inspect(evalued, { depth: 0 });
                } catch (err) {
                    evalued = err.toString();
                }
                break;
            }
            case '-sh': {
                if (!args[1]) return message.channel.send('What should I run in the terminal?');
                evalued = args.slice(1).join(' ');
                try {
                    const { stdout, stderr } = await promisify(exec)(evalued);
                    if (!stdout && !stderr) return message.channel.send('I ran that but there\'s no nothing to show.');
                    if (stdout)
                        evalued = stdout;
                    if (stderr)
                        evalued = stderr;
                } catch (err) {
                    evalued = err.toString();
                }
                break;
            }
            default: {
                if (!args[0]) return message.channel.send('What do you wanna evaluate?');
                try {
                    evalued = await eval(args.join(' '));
                    evalued = inspect(evalued, { depth: 0 });
                } catch (err) {
                    evalued = err.toString();
                }
                break;
            }
        }

        const msg = await message.channel.send(evalued.slice(0, 1950), {
            code: args[0]?.toLowerCase() === '-sh' ? 'sh' : 'js'
        });
        try {
            await msg.react('🔨');
            await msg.awaitReactions((r, u) => r.emoji.name === '🔨' && u.id === message.author.id, { time: 20000, max: 1, errors: ['time'] });
            if (msg.deletable)
                await msg.delete();
        } catch {
            if (!msg.deleted)
                await msg.reactions.resolve('🔨')?.users.remove();
        }

        return msg;
    }
}