import { ChannelType, userMention } from "discord.js";
import { Events } from "../Interfaces";
import db from "croxydb";

export const Event: Events = {
    name: "ready",
    once: false,

    async execute(client) {
        console.success("I have successfully logged into Discord")

        let keys: string[] = db.fetch(`keys`);
        if(keys && keys.length) {
            setInterval(() => {
                keys.forEach((key) => {
                    let sipariş: {
                        ms: number,
                        date: string,
                        name: string,
                        id: string,
                        key: string,
                        datee: number,
                        owner: string,
                        datacenter: string
                    } = db.fetch(`sipariş_${key}`);
                    
                    if(sipariş) {
                        let time = sipariş.ms - (Date.now() - sipariş.datee)

                        if(time < 0) {
                            db.delete(`sipariş_${key}`, true)
                            db.unpush(`keys`, key)
                            db.push(`oldKeys`, key)
                
                            let channel = client.channels.cache.get(client.config.remove)
                
                            if(channel && channel.type === ChannelType.GuildText) {
                                channel.send({
                                    content: `> ${userMention(sipariş.id)} adlı kullanıcının ${sipariş.name} adlı ürünü **süre bitti** sebebiyle sistem tarafından silindi.`
                                })
                            }
                        }   
                    }                   
                })
            }, 5000)
        }
    },
}