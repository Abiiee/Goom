/* eslint-disable no-unused-vars */
import { Collection, Message, TextChannel, PermissionString } from 'discord.js-light';
import Agness from '../bot';

const devs = process.env.DEVS ? process.env.DEVS.split(', ') : [];

export type Category = 'General';

interface CommandOptions {
    name: string;
    category: string;
    aliases?: string[];
    description?: string;
    usageArgs?: string[];
    example?(p: string): string;
    botGuildPermissions?: PermissionString[];
    botChannelPermissions?: PermissionString[];
    memberGuildPermissions?: PermissionString[];
    memberChannelPermissions?: PermissionString[];
    cooldown?: number;
    enabled?: boolean;
    guildOnly?: boolean;
    nsfwOnly?: boolean;
    devsOnly?: boolean;
}

export default abstract class Command {
    name: string;
    category: Category;
    aliases: string[];
    description: string;
    usageArgs: string[];
    example: (p: string) => string;
    botGuildPermissions: PermissionString[];
    botChannelPermissions: PermissionString[];
    memberGuildPermissions: PermissionString[];
    memberChannelPermissions: PermissionString[];
    cooldown: number;
    enabled: boolean;
    guildOnly: boolean;
    nsfwOnly: boolean;
    devsOnly: boolean;
    cooldowns = new Collection();
    prefix?: string;

    constructor(public client: Agness, options: CommandOptions) {
        this.name = options.name;
        this.aliases = options.aliases ?? [];
        this.category = (options.category ?? 'General') as Category;
        this.description = options.description ?? '';
        this.usageArgs = options.usageArgs ?? [];
        this.example = options.example ?? ((p) => `${p}${this.name}`);
        this.botGuildPermissions = options.botGuildPermissions ?? [];
        this.botChannelPermissions = options.botChannelPermissions ?? [];
        this.memberGuildPermissions = options.memberGuildPermissions ?? [];
        this.memberChannelPermissions = options.memberChannelPermissions ?? [];
        this.cooldown = options.cooldown ?? 2;
        this.enabled = options.enabled ?? true;
        this.guildOnly = typeof options.guildOnly === 'boolean' ? options.guildOnly : this.category !== 'General';
        this.nsfwOnly = options.nsfwOnly ?? false;
        this.devsOnly = options.devsOnly ?? false;
    }

    usage(p: string): string {
        return `${p}${this.name} ${this.usageArgs.join(' ')}`.trim();
    }

    prepare(prefix: string): void {
        this.prefix = prefix;
    }

    // eslint-disable-next-line no-unused-vars
    abstract run(message: Message, args: string[]): Promise<Message | void>;

    async canRun(message: Message): Promise<boolean> {
        const channel = (message.channel as TextChannel);
        if (message.guild && !channel.permissionsFor(message.guild!.me!).has('SEND_MESSAGES')) return false;
        if (!this.enabled && !devs.includes(message.author.id))
            return !this.sendOrReply(message, 'This command is under maintenance.');
        if (this.checkCooldowns(message) && !devs.includes(message.author.id))
            return !message.channel.send(`You have to wait **${Number(((this.cooldowns.get(message.author.id) as number) - Date.now()) / 1000).toFixed(2)}s** to execute this command.`);
        if (this.guildOnly && !message.guild) return !this.sendOrReply(message, 'This command is only available for servers.');
        if (this.devsOnly && !devs.includes(message.author.id))
            return !this.sendOrReply(message, 'This command can only be used by developers.');
        if (message.guild && !channel.nsfw && this.nsfwOnly)
            return !this.sendOrReply(message, 'This command can only be used on NSFW channels.');
        if (message.guild && this.memberGuildPermissions[0] && !this.memberGuildPermissions.every((p) => message.member!.permissions.has(p)) && !devs.includes(message.author.id))
            return !this.sendOrReply(message, `You need the following permissions: \`${this.memberGuildPermissions.map(this.parsePermission).join(', ')}\``);
        if (message.guild && this.memberChannelPermissions[0] && !this.memberChannelPermissions.every((p) => channel.permissionsFor(message.member!).has(p)) && !devs.includes(message.author.id))
            return !this.sendOrReply(message, `You need the following permissions on this channel: \`${this.memberChannelPermissions.map(this.parsePermission).join(', ')}\``);
        if (message.guild && this.botGuildPermissions[0] && !this.botGuildPermissions.every((p) => message.guild!.me!.permissions.has(p)))
            return !this.sendOrReply(message, `I need the following permissions: \`${this.botGuildPermissions.map(this.parsePermission).join(', ')}\``);
        if (message.guild && this.botChannelPermissions[0] && !this.botChannelPermissions.every((p) => channel.permissionsFor(message.guild!.me!).has(p)))
            return !this.sendOrReply(message, `I need the following permissions on this channel: \`${this.botChannelPermissions.map(this.parsePermission).join(', ')}\``);
        return true;
    }

    checkCooldowns(message: Message): boolean {
        if (this.cooldowns.has(message.author.id)) return true;
        this.cooldowns.set(message.author.id, Date.now() + (this.cooldown * 1000));
        setTimeout(() => {
            this.cooldowns.delete(message.author.id);
        }, this.cooldown * 1000);
        return false;
    }
    parsePermission(permission: PermissionString) {
        return permission.toLowerCase()
            .replace(/_/g, ' ')
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
    }
    sendOrReply(message: Message, text: string): Promise<Message> {
        if (message.guild && !(message.channel as TextChannel).permissionsFor(message.guild!.me!).has('READ_MESSAGE_HISTORY'))
            return message.channel.send(text);
        return message.reply(text, { allowedMentions: { users: [] } });
    }

    sendError(message: Message, text: string, arg: number): Promise<Message> {
        const values = [`> ${this.prefix}${this.name}`, ...this.usageArgs];
        const characters = this.usageArgs[arg].replace(/[^a-z\s]/gi, '_').replace(/[a-z\s]/gi, '^').replace(/_/gi, ' ');
        return message.channel.send(`\`\`\`diff
- ${text}
${values.join(' ')}
- ${characters.padStart(values.slice(0, arg + 1).join(' ').length + characters.length - 1, ' ')}\`\`\``);
    }
}