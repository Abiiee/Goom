import { Document, Schema, Model, model } from 'mongoose';

export interface Setting extends Document {
    guildID: string;
    modLogs: string;
    modRoleID: string;
    muteRoleID: string;
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
});

export const Settings: Model<Setting> = model('settings', settings);