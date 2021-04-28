import { Document, Schema, Model, model } from 'mongoose';

export interface Punishments {
    TYPE: 'mute' | 'tempmute' | 'kick' | 'ban'  | 'tempban' | 'softban';
    cases: number
    time: number
}

export interface Setting extends Document {
    guildID: string;
    modLogs: string;
    modRoleID: string;
    muteRoleID: string;
    punishments: Punishments[]
}

const settings: Schema<Setting> = new Schema({
    guildID: {
        type: String,
        required: true,
        unique: true
    },
    modRoleID: {
        type: String,
        default: ''
    },
    muteRoleID: {
        type: String,
        default: ''
    },
    modLogs: {
        type: String,
        default: ''
    },
    punishments: {
        type: [Object],
        default: [
            {
                type: 'tempmute',
                cases: 2,
                time: 30 * 60000
            },
            {
                type: 'tempmute',
                case: 3,
                time: 12 * 60 * 60000
            },
            {
                type: 'kick',
                case: 4,
                time: 0
            },
            {
                type: 'ban',
                case: 5,
                time: 0
            }
        ]
    }

});

export const Settings: Model<Setting> = model('settings', settings);