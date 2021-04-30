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
    amount: number;
    cases: number;
}

export interface AutoMod extends Document {
    guildID: string;
    punishments: Punishments[];
    antiInvites: AntiInvites;
    antiZalgo: Number;
    messageSpam: MessageSpam;
    antiDuplicateMessage: number;
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
    punishments: {
        type: [Object],
        default: [
            {
                TYPE: 'tempmute',
                cases: 2,
                time: 30 * 60000
            },
            {
                TYPE: 'tempmute',
                cases: 3,
                time: 12 * 60 * 60000
            },
            {
                TYPE: 'kick',
                cases: 4,
                time: 0
            },
            {
                TYPE: 'ban',
                cases: 6,
                time: 0
            }
        ]
    },
    antiInvites: {
        type: Object,
        default: {
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
    antiDuplicateMessage: {
        type: Number,
        default: 1
    },
    antiMassCaps: {
        type: Object,
        default: {
            amount: 10,
            cases: 1
        }
    },
    antiMassSpoilers: {
        type: Object,
        default: {
            amount: 0,
            cases: 0
        }
    },
    antiMassAttachments: {
        type: Object,
        default: {
            amount: 4,
            cases: 1
        }
    },
    antiMassEmojis: {
        type: Object,
        default: {
            amount: 8,
            cases: 1
        }
    },
    antiMaxCharacters: {
        type: Object,
        default: {
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