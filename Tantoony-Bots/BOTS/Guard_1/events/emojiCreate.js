const functionz = require('../helpers/functionz');
const jailed = require('../../../../MODELS/permajails');
const sicil = require('../../../../MODELS/sicil');
const Discord = require('discord.js');
const low = require('lowdb');
const izin = require('../../../../MODELS/izin');
module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(emoji) {

        const client = this.client;

        var index = await emoji.guild.fetchAuditLogs({
            limit: 1,
            type: 'EMOJI_CREATE',
        });
        const utiller = await low(this.client.adapters('utiller'));
        const roller = await low(client.adapters('roller'));
        const kanallar = await low(client.adapters('kanallar'));
        const emojiler = await low(client.adapters('emojiler'));
        const emojis = emojiler.value();
        const lokal = emoji.guild.channels.cache.get(kanallar.get("log-emoji").value());
        const embed = new Discord.MessageEmbed();
        let logs = index.entries.first();
        if (logs.createdTimestamp <= Date.now() - 5000) return;
        const mal = emoji.guild.members.cache.get(logs.executor.id);
        if (mal.user.bot) return;
        const systemf = await izin.findOne({ _id: mal.user.id });
        if (systemf && (systemf.type === "create") && (systemf.effect === "emoji")) {
            if (systemf.count > 0) {
                await izin.updateOne({ _id: mal.user.id }, { $inc: { count: -1 } });
                return lokal.send(new Discord.MessageEmbed().setDescription(`${emojiler.get("idea").value()} **${emoji.name}** emojisi ${mal} tarafından başarıyla oluşturuldu`));
            } else {
                await izin.deleteOne({ _id: mal.user.id });
            };
        };
        if (utiller.get("kkv").value().some(id => logs.executor.id === id)) return lokal.send(new Discord.MessageEmbed().setDescription(`${emojiler.get("idea").value()} **${emoji.name}** emojisi ${mal} tarafından başarıyla oluşturuldu`));
        if (mal.roles.cache.has(roller.get("root").value())) return lokal.send(new Discord.MessageEmbed().setDescription(`${emojiler.get("idea").value()} **${emoji.name}** emojisi ${mal} tarafından başarıyla oluşturuldu`));
        if (mal.roles.cache.has(roller.get("owner").value())) return lokal.send(new Discord.MessageEmbed().setDescription(`${emojiler.get("idea").value()} **${emoji.name}** emojisi ${mal} tarafından başarıyla oluşturuldu`));
        let rolz = [];
        let rolidleri = [];
        let system = await jailed.findOne({ _id: mal.user.id });
        await mal.roles.cache.forEach(async (ele) => {
            if (ele.id !== roller.get("th-booster").value()) {
                rolz.push(ele.name);
                rolidleri.push(ele.id);
            };
        });
        mal.roles.remove(rolidleri);
        mal.roles.add(roller.get("th-jail").value());
        if (!system) {
            try {
                let doggy = await jailed({ _id: mal.user.id, sebep: "KURAL DIŞI EYLEM - EMOJİ OLUŞTURMA", executor: emoji.guild.owner.id, rolz: rolz, created: new Date() });
                await doggy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        };
        if (emoji.guild.member(mal).voice && emoji.guild.member(mal).voice.channel) emoji.guild.member(mal).voice.setChannel(null);
        lokal.send(`${emojis.jailed} ${mal} Başarıyla ${this.client.owner} tarafından cezalıya atıldı!`);
        const embedd = embed.setTitle(`Jaile Gönderildi`).setDescription(`${emojis.jailed} ${mal} kişisi ${this.client.owner} tarafından cezalıya atıldı`)
            .addField("Sebep:", "KURAL DIŞI EYLEM - EMOJİ OLUŞTURMA", true).addField("Süre", `**Perma**`, true).setThumbnail(mal.user.displayAvatarURL({ dynamic: true }))
            .setAuthor("Koruma Sistemi", emoji.guild.iconURL({ dynamic: true }))
            .setFooter(`Tantoony Bots`).setTimestamp();
        emoji.guild.channels.cache.get(kanallar.get("cmd-jail").value()).send(embedd);
        const obje = {
            date: new Date(),
            type: `PermaJail`,
            executor: this.client.owner.id,
            reason: "KURAL DIŞI EYLEM - EMOJİ OLUŞTURMA"
        }
        let invarray = [];
        let gg = invarray.push(obje);
        let systemm = await sicil.findOne({ _id: mal.user.id });
        if (!systemm) {
            try {
                let doffy = await sicil({ _id: mal.user.id, punishes: gg });
                await doffy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        } else {
            await sicil.updateOne({ _id: mal.user.id }, { $push: { punishes: obje } });
        }
        emoji.delete();
        lokal.send(new Discord.MessageEmbed().setDescription(`${emojiler.get("warn").value()} ÖNEMLİ UYARI!!!! ${logs.executor} bir emoji oluşturmaya çalıştı. Oluşturulan emoji: ${emoji.name}`));

    }
} 
