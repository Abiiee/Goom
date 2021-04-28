import Command from '../../structures/Command';
import { Message } from 'discord.js';
import Agness from '../../bot';

export default class PingCommand extends Command {
    constructor(client: Agness, category: string) {
        super(client, {
            name: 'ping',
            category
        });
    }

    async run(message: Message): Promise<Message> {
        return message.channel.send(`Pong! ${this.client.ws.ping}ms.`);
    }
}