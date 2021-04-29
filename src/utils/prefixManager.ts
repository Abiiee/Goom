import { Servers } from "../database/server";
import { Collection } from 'discord.js-light';

interface Prefixes {
    prefix: string;
    guildID: string;
}


class PrefixManager {
    collection: Collection<string, Prefixes>
    constructor() {

        this.collection = new Collection();

    }

    async set (guildID: string, newPrefix) { 

        const data = await Servers.findOneAndUpdate({ guildID }, { prefix: newPrefix },{ new: true, upsert: true }})
et
        
    }

}