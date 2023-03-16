/*
github.com/romanwashere
*/
import { Commands } from "../../Interfaces";

export const Command: Commands = {
    name: "ping",
    description: "Show bot ping!",

    async execute(client, interaction) {
        interaction.reply("Pong!")
    },
}