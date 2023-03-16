import { ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock, EmbedBuilder } from "discord.js";
import { Commands } from "../../Interfaces";

export const Command : Commands = {
    name: "yardım",
    description: "Sizlere hizmet eden botun yardım menüsünü görebilirsin.",

    async execute(client, interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder()
        .setColor("#2F3136")
        .setAuthor({ name: interaction.user.tag, iconURL: `${interaction.user.avatarURL() || client.user?.avatarURL()}` })
        .setTitle(`${client.user.username} Yardım Paneli`)
        .addFields({
            name: "Komutlar",
            value: `${codeBlock("yaml", `${client.commands.map((cmd) => `/${cmd.name}`).join(", ")}`)}`
        })

        interaction.followUp({
            embeds: [
                embed
            ],
        })
    }
}