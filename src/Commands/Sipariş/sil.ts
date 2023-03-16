/*
github.com/romanwashere
*/
import { ChannelType, EmbedBuilder, userMention } from "discord.js";
import { Commands } from "../../Interfaces";
import db from "croxydb";

export const Command: Commands = {
    name: "sil",
    description: "Bir sipariş aboneliğini erken bitirin.",
    options: [
        {
            type: 3,
            name: "anahtar",
            description: "Bir anahtar giriniz.",
            required: true
        }
    ],

    async execute(client, interaction) {
        await interaction.deferReply();

        if(!client.config.owners.includes(interaction.user.id)) return;

        let key = interaction.options.get("anahtar").value;
        let sipariş: {
            ms: number,
            date: string,
            name: string,
            id: string,
            key: string,
            owner: string,
            datacenter: string
        } = db.fetch(`sipariş_${key}`)

        if(!db.fetch(`oldKeys`)) db.set(`oldKeys`, [])

        if(!sipariş) {
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(":x: **|** Böyle bir kod bulamadım.")
                ]
            })
        } else {    
            let user = (await interaction.guild.members.fetch(sipariş.id)).user;
        try {
            db.delete(`sipariş_${key}`, true)
            db.unpush(`keys`, key)
            db.push(`oldKeys`, key)

            let channel = interaction.guild.channels.cache.get(client.config.remove)

            if(channel && channel.type === ChannelType.GuildText) {
                channel.send({
                    content: `> ${userMention(user.id)} adlı kullanıcının ${sipariş.name} adlı ürünü ${userMention(interaction.user.id)} tarafından silindi.`
                })
            }

            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTitle(`Bir abonelik sonlandırıldı`)
                    .setThumbnail(user.displayAvatarURL())
                    .addFields([
                        {
                            name: "Satış anahtarı;",
                            value: `> ${sipariş.key}`,
                            inline: true
                        },
                        {
                            name: "Satın alan;",
                            value: `> ${userMention(user.id)}`,
                            inline: true
                        },
                        {
                            name: "Ürün adı;",
                            value: `> ${sipariş.name}`,
                            inline: true
                        },
                    ])
                    .setFooter({ text: `İşlemi gerçekleştiren: ${sipariş.owner}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                    .setTimestamp()
                ]
            });
        } catch (err) {
            console.log(err)
        }
        
        }
    },
}