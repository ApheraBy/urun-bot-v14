/*
github.com/romanwashere
*/
import { EmbedBuilder, userMention } from "discord.js";
import { Commands } from "../../Interfaces";
import db from "croxydb";
import ms from "ms";

export const Command: Commands = {
    name: "sorgu",
    description: "Verilen sipariş anahtarı ile siparişi sorgularsınız",
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
            not: string,
            owner: string,
            datacenter: string
        } = db.fetch(`sipariş_${key}`)

        let oldKeys: string[] = db.fetch(`oldKeys`);
        if(!oldKeys) db.set(`oldKeys`, [])

        if(!sipariş) {
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(":x: **|** "+oldKeys && oldKeys.includes(`${key}`) ? "Bu kod daha önceden kullanılıp silinmiş." : "Böyle bir kod bulamadım"+".")
                ]
            })
        } else {
            let user = (await interaction.guild.members.fetch(sipariş.id)).user;
        try {
            const date = new Date(`${sipariş.date}`)
            let datee = date.getTime() - Date.now()

            let  time = ms(datee, {
                long: false
            });

            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTitle(`Bir kullanıcı anahtarı sorgulanıyor`)
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
                        {
                            name: "Ne zaman aldı?",
                            value: `> Ürün aboneliği **${sipariş.date}** tarihinde satın alındı.`,
                            inline: true
                        },
                        {
                            name: "Ne zaman bitiyor?",
                            value: `> Ürün aboneliğiniz **${time.replaceAll("h", " saat").replaceAll("d", " gün").replaceAll("y", " yıl").replaceAll("w", " hafta")}** sonra biticektir.`,
                            inline: true
                        },
                        {
                            name: "Hangi sunucuda barınıyor?",
                            value: `> ${sipariş.datacenter}`,
                            inline: true
                        },
                        {
                            name: "Ekstra not;",
                            value: `> ${sipariş.not}`,
                            inline: true
                        }
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