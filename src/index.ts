import { ShardingManager } from 'discord.js';
import { config } from 'dotenv';
import { join } from 'path';

config();

const manager = new ShardingManager(join(__dirname, 'bot.js'), {
    token: process.env.BOT_TOKEN
});

manager.spawn();