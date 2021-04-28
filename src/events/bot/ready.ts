import Event from '../../structures/Event';
import Agness from '../../bot';

export default class ReadyEvent extends Event {
    constructor(client: Agness) {
        super(client, {
            name: 'ready'
        });
    }

    async run(): Promise<void> {
        console.log(`DISCORD - Inicie sesión como: ${this.client.user!.tag}`);
        this.client.user!.setActivity(`@${this.client.user!.username} help`, { type: 'WATCHING'});
        setInterval(() => {
            this.client.user!.setActivity(`@${this.client.user!.username} help`, { type: 'WATCHING'});
        }, 60 * 1000);
    }
}