import { Document, Schema, Model, model } from 'mongoose';

export interface CasesArray {
    mod: string;
    reason: string;
    timestamp: Date;
}

export interface Case extends Document {
    memberID: string
    cases: CasesArray[]
}

const cases: Schema<Case> = new Schema({
    memberID: {
        type: String,
        required: true,
        unique: true
    },
    cases: {
        type: [Object],
        default: []
    }
});

export const Cases: Model<Case> = model('cases', cases);