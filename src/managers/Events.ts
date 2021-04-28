import { readdirSync, statSync } from 'fs';
import Event from '../structures/Event';
import { join } from 'path';
import Agness from '../bot';

export default class Events {
    // eslint-disable-next-line
    constructor(public client: Agness) { }

    async load(): Promise<void> {
        const folder = join(__dirname, '../events/');
        const categories = readdirSync(folder).filter(f => statSync(join(folder, f)).isDirectory());
        for (const category of categories) {
            const events = readdirSync(join(folder, category)).filter(x => x.endsWith('.js'));
            for (const event of events) {
                const eventFile = await import(join(folder, category, event));
                const eventClass: Event = new eventFile.default(this.client);
                this.client.on(eventClass.name, (...args) => eventClass.run(...args));
            }
        }
    }
}