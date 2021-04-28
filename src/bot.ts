import { Client } from 'discord.js';
import Commands from './managers/Commands';
import Events from './managers/Events';
import { connect } from 'mongoose';
import { config } from 'dotenv';

config();

export default class Goom extends Client {
    commands = new Commands(this);
    events = new Events(this);
    color = '#66e7ae';
    constructor() {
        super({
            partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'GUILD_MEMBER', 'USER'],
            intents: 5635
        });

        connect(process.env.MONGO_URL as string, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err) return console.log(`Mongo Error: ${err.stack ?? err}`);
            console.log('MONGODB - Base de datos conectada');
        });
        this.commands.load();
        this.events.load();
        this.login(process.env.BOT_TOKEN);
    }
}

new Goom();