import { Document, Schema, Model, model } from 'mongoose';

export interface Server extends Document {
    guildID: string;
    prefix: string;
}

const servers: Schema<Server> = new Schema({
    guildID: {
        type: String,
        required: true,
        unique: true
    },
    prefix: {
        type: String,
        default: process.env.BOT_PREFIX
    },
});

export const Servers: Model<Server> = model('server', servers);