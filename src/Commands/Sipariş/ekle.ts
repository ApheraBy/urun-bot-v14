/*
github.com/romanwashere
*/
import { ChannelType, EmbedBuilder, userMention } from "discord.js";
import { Commands } from "../../Interfaces";
import db from "croxydb";
import ms from "ms";

export const Command: Commands = {
    name: "ekle",
    description: "Sipariş sistemine bir kullanıcı eklersiniz",
    options: [
        {
            type: 6,
            name: "kullanıcı",
            description: "Bir kullanıcıyı etiketlemeniz zorunludur.",
            required: true
        },
        {
            type: 3,
            name: "ürün_adı",
            description: "Bir ürün adını girin.",
            required: true
        },
        {
            type: 3,
            name: "tarih",
            description: "Bitiş tarihi giriniz. (ay-gün-yıl)",
            required: true
        },
        {
            type: 3,
            name: "datacenter",
            description: "Abonelik hangi sunucuda barınıyor?",
            required: true
        },
        {
            type: 3,
            name: "not",
            description: "Varsa bir notunuz?",
            required: true
        }
    ],

    async execute(client, interaction) {
        await interaction.deferReply();

        if(!client.config.owners.includes(interaction.user.id)) return;

        function generateKey() {
            var length = 8,
                charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                retVal = "";
            for (var i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }
            return retVal;
        }
     
        let user = interaction.options.getUser("kullanıcı");
        let productName = interaction.options.get("ürün_adı").value;
        let dateString = interaction.options.get("tarih").value;
        let not = interaction.options.get("not").value || "Hayırlı kazançlar";

        let userKey = generateKey();

        try {
            const date = new Date(`${dateString}`)
            let datee = date.getTime() - Date.now()

            let  time = ms(datee, {
                long: false
            });

            db.set(`sipariş_${userKey}`, {
                ms: datee,
                date: dateString,
                datee: Date.now(),
                name: `${productName}`,
                datacenter: `${interaction.options.get("datacenter").value}`,
                id: `${user.id}`,
                key: `${userKey}`,
                owner: `${interaction.user.tag}`,
                not: `${not}`
            });
            
            if(!db.fetch("keys")) db.set("keys", [])
            db.push(`keys`, `${userKey}`);

            let channel = interaction.guild.channels.cache.get(client.config.add)

        if(channel && channel.type === ChannelType.GuildText) {
            channel.send({
                content: `> ${userMention(user.id)} adlı kullanıcı ${productName} adlı ürünü satın aldı, bitiş tarihi: ${dateString}`
            })
        }
/*
github.com/romanwashere
*/

            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTitle(`Bir ürün satın alındı`)
                    .setThumbnail(user.displayAvatarURL())
                    .addFields([
                        {
                            name: "Satış anahtarı;",
                            value: `> ${userKey}`,
                            inline: true
                        },
                        {
                            name: "Satın alan;",
                            value: `> ${userMention(user.id)}`,
                            inline: true
                        },
                        {
                            name: "Ürün adı;",
                            value: `> ${productName}`,
                            inline: true
                        },
                        {
                            name: "Ne zaman bitiyor?",
                            value: `> Ürün aboneliğiniz **${time.replaceAll("h", " saat").replaceAll("d", " gün").replaceAll("y", " yıl").replaceAll("w", " hafta")}** sonra biticektir.`,
                            inline: true
                        }
                    ])
                    .setFooter({ text: `Not; ${not}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                    .setTimestamp()
                ]
            });
        } catch (err) {
            console.log(err)
        }
    },
}