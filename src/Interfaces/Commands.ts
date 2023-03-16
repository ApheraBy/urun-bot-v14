import { GuildChannelTypes, CommandInteraction } from "discord.js";
import { Bot } from "../Client";

interface Localizations {
    it: string,
    en: string
}

interface Choices {
    name: string,
    name_localizations?: string,
    value: string | number,
}

interface Options {
    type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11,
    name: string,
    name_localizations?: Localizations,
    description: string,
    description_localizations?: Localizations,
    required?: boolean,
    choices?: Choices[],
    options?: Options[],
    channel_types?: GuildChannelTypes[],
    min_value?: number,
    max_value?: number,
    min_length?: number,
    max_length?: number,
    autocomplete?: boolean
}

export interface Commands {
    name: string,
    name_localizations?: Localizations,
    description: string,
    description_localizations?: Localizations,
    options?: Options[],
    default_member_permissions?: number,
    dm_permission?: boolean,
    nsfw?: boolean,
    execute: (client: Bot, interaction: CommandInteraction) => Promise<void> | any;
}