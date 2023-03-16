/*
github.com/romanwashere
*/
import { EmbedBuilder } from "discord.js";
import { Commands } from "../../Interfaces";
import db from "croxydb";

export const Command: Commands = {
    name: "eskikodlar",
    description: "Önceden ayarlanmış kodları gösterir.",

    async execute(client, interaction) {
        await interaction.deferReply();

        if(!client.config.owners.includes(interaction.user.id)) return;

        let sipariş: string[] = db.fetch(`oldKeys`);
        if(!sipariş) db.set(`oldKeys`, [])

        if(!sipariş || !sipariş.length) {
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(":x: **|** Daha eski kodlar aktarılmamış.")
                ]
            })
        } else {             
        try {
  
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTitle(`Silinmiş abonelik anahtarları`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setDescription(sipariş.map(x => `\` > \` **|** ${x}`).join("\n"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                    .setTimestamp()
                ]
            });
        } catch (err) {
            console.log(err)
        }
        
        }
    },
}