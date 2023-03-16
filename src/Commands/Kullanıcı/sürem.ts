/*
github.com/romanwashere
*/
import { EmbedBuilder } from "discord.js";
import { Commands } from "../../Interfaces";
import db from "croxydb";
import ms from "ms";

export const Command: Commands = {
    name: "sürem",
    description: "Girilen anahtarın kaç süresi kalmış bakabilirsiniz.",
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
                    .setDescription(`> ${sipariş.name} adlı Ürün aboneliğiniz **${time.replaceAll("h", " saat").replaceAll("d", " gün").replaceAll("y", " yıl").replaceAll("w", " hafta")}** sonra biticektir.`)
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