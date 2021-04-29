import { Document, Schema, Model, model } from 'mongoose';

export interface Punishments {
    TYPE: 'mute' | 'tempmute' | 'kick' | 'ban'  | 'tempban' | 'softban';
    cases: number;
    time: number;
}

export interface AntiInvites extends Document {
    enabled: boolean;
    whiteList: string[];
    cases: number;
}

export interface AntiRaid extends Document {
    joins: number;
    seconds: number;
}

export interface MessageSpam extends Document {
    messages: number;
    seconds: number;
    cases: number
}

export interface BaseAutoModMass extends Document {
    enabled: boolean;
    amount: number;
    cases: number;
}

export interface AutoMod extends Document {
    guildID: string;
    punishments: Punishments[];
    antiInvites: AntiInvites;
    antiZalgo: Number;
    messageSpam: MessageSpam;
    antiMassCaps: BaseAutoModMass;
    antiMassSpoilers: BaseAutoModMass;
    antiMassAttachments: BaseAutoModMass;
    antiMassEmojis: BaseAutoModMass;
    antiMaxCharacters: BaseAutoModMass;
    antiRaid: AntiRaid;
    usersIgnored: string[];
    rolesIgnored: string[]
}

const automod: Schema<AutoMod> = new Schema({
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
                case: 6,
                time: 0
            }
        ]
    },
    antiInvites: {
        type: Object,
        default: {
            enabled: true,
            cases: 2
        }
    },
    antiZalgo: {
        type: Number,
        default: 0
    },
    messageSpam: {
        type: Object,
        default: {
            messages: 5,
            seconds: 2,
            cases: 1
        }
    },
    antiMassCaps: {
        type: Object,
        default: {
            enabled: true,
            amount: 10,
            cases: 1
        }
    },
    antiMassSpoilers: {
        type: Object,
        default: {
            enabled: true,
            amount: 5,
            cases: 1
        }
    },
    antiMassAttachmets: {
        type: Object,
        default: {
            enabled: true,
            amount: 4,
            cases: 1
        }
    },
    antiMassEmojis: {
        type: Object,
        default: {
            enabled: true,
            amount: 8,
            cases: 1
        }
    },
    antiMaxCharacters: {
        type: Object,
        default: {
            enabled: true,
            amount: 250,
            cases: 1
        }
    },
    antiRaid: {
        type: Object,
        default: {
            joins: 10,
            seconds: 5
        }
    },
    usersIgnored: {
        type: [String],
        default: []
    },
    rolesIgnored : {
        type: [String],
        default: []
    }

});

export const Automods: Model<AutoMod> = model('automod', automod);