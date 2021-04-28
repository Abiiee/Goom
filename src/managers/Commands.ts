import Command from '../structures/Command';
import { readdirSync, statSync } from 'fs';
import { Collection } from 'discord.js';
import { join } from 'path';
import Agness from '../bot';

export default class Commands extends Collection<string, Command> {
    // eslint-disable-next-line no-unused-vars
    constructor(public client: Agness) {
        super();
    }

    async load(): Promise<void> {
        const folder = join(__dirname, '../commands/');
        const categories = readdirSync(folder).filter(f => statSync(join(folder, f)).isDirectory());
        for (const category of categories) {
            const commands = readdirSync(join(folder, category)).filter(x => x.endsWith('.js'));
            for (const command of commands) {
                const commandFile = await import(join(folder, category, command));
                const commandClass: Command = new commandFile.default(this.client, category);
                const existentCommand = this.find((c) => commandClass.constructor.name === c.constructor.name || commandClass.name === c.name);
                if (existentCommand) console.log(`A command with duplicate class name or name was found (${commandClass.name}/${commandClass.constructor.name} and ${existentCommand.name}/${existentCommand.constructor.name})`);
                this.set(commandClass.name, commandClass);
            }
        }
    }

    get(name?: string): Command | undefined {
        if (!name) return undefined;
        return this.find((c) => c.name === name || c.aliases.includes(name));
    }
}