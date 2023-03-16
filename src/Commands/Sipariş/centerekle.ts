/*
github.com/romanwashere
*/
import { EmbedBuilder, userMention } from "discord.js";
import { Commands } from "../../Interfaces";
import db from "croxydb";

export const Command: Commands = {
    name: "centerekle",
    description: "Bir center eklemesi yapabilirsin.",
    options: [
        {
            type: 3,
            name: "isim",
            description: "Center ismi giriniz",
            required: true
        }
    ],

    async execute(client, interaction) {
        await interaction.deferReply();

        if(!client.config.owners.includes(interaction.user.id)) return;

        if(!db.fetch(`centers`)) db.set(`centers`, [])

        const centers: string[] = db.fetch(`centers`);
        let centerName = interaction.options.get("isim").value;
        let center = centers.find(x => x.startsWith(`${centerName}-`))

        if(centers && !centers.includes(center)) {
            db.push(`centers`, `${centerName}-${new Date().toLocaleDateString("tr")}`)

            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTitle(`Sisteme bir center eklendi`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .addFields([
                        {
                            name: "Center ismi;",
                            value: `> ${centerName}`,
                            inline: true
                        },
                        {
                            name: "Kim oluşturdu;",
                            value: `> ${userMention(interaction.user.id)}`,
                            inline: true
                        },
                        {
                            name: "Oluşturduğu tarih;",
                            value: `> ${new Date().toLocaleDateString("tr")}`,
                            inline: true
                        },
                       
                    ])
                    .setFooter({ text: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                    .setTimestamp()
                ]
            });
        } else {
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(":x: **|** Bu center zaten eklenmiş.")  
                ]
            })
    }
    },
}