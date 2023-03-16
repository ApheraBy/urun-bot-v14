/*
github.com/romanwashere
*/
import { EmbedBuilder } from "discord.js";
import { Commands } from "../../Interfaces";
import db from "croxydb";

export const Command: Commands = {
    name: "centerlar",
    description: "Bir center eklemesi yapabilirsin.",

    async execute(client, interaction) {
        await interaction.deferReply();

        if(!client.config.owners.includes(interaction.user.id)) return;

        if(!db.fetch(`centers`)) db.set(`centers`, [])

        const centers: string[] = db.fetch(`centers`);

        if(centers && centers.length) {
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTitle(`Silinmiş abonelik anahtarları`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setDescription(centers.map(x => `\` > \` **|** ${x.split("-")[0]} **-** ${x.split("-")[1]}`).join("\n"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                    .setTimestamp()
                ]
            });
        } else {
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(":x: **|** Şuana kadar bir center eklenmemiş.")  
                ]
            })
        }
    },
}