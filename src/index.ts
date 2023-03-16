import { Bot } from "./Client";

const client = new Bot({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildMessages"
    ]
});

client.init();