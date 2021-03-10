const Discord = require("discord.js");
const low = require('lowdb');
const jailed = require('../../../../MODELS/permajails');
const sicil = require('../../../../MODELS/sicil');

module.exports = class {

    constructor(client) {
        this.client = client;

    }

    async run(member) {

        const client = this.client;
        const utiller = await low(this.client.adapters('utiller'));
        const roller = await low(client.adapters('roller'));
        const kanallar = await low(client.adapters('kanallar'));
        const emojis = await low(client.adapters('emojiler'));

        var index = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        let logs = index.entries.first();
        //console.log(logs);
        const kanal = member.guild.channels.cache.get(kanallar.get("gk-giden").value());
        const kanalag = member.guild.channels.cache.get(kanallar.get("gk-uyarı").value());
        if (logs.createdTimestamp <= Date.now() - 3000) {

            let embed = new Discord.MessageEmbed()
                .setAuthor("Tantoony Hepinizi Seviyor <3!", 'https://cdn.discordapp.com/avatars/674565119161794560/a_827656d647e06ad88e50e919c258a430.gif?size=1024')
                .setColor("#2f3136")
                .setFooter("10 Aralık 2020'den İtibaren...", client.user.displayAvatarURL())
                .setTitle("Birisi Sunucudan Ayrıldı!")
                .addField("Katılma tarihi: ", member.joinedAt)
                .setDescription(`${member} sunucumuzdan ayrıldı!`)
                .setTimestamp()
                .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
            return kanal.send(embed);
        };
        if (logs.executor.bot) return;
        const mal = member.guild.members.cache.get(logs.executor.id);
        if (mal.roles.cache.some(r => r.id === roller.get("root").value())) return kanalag.send(new Discord.MessageEmbed().setDescription(`${emojis.get("idea").value()} ${mal} sağ tık kullanarak ${masum} kişisini sunucudan attı!`));;
        if (utiller.get("kkv").value().some(id => logs.executor.id === id)) return kanalag.send(new Discord.MessageEmbed().setDescription(`${emojis.get("idea").value()} ${mal} sağ tık kullanarak ${masum} kişisini sunucudan attı!`));
        let rolz = [];
        let rolidleri = [];
        let system = await jailed.findOne({ _id: mal.user.id });
        await mal.roles.cache.forEach(async (ele) => {
            if (ele.id !== roller.get("th-booster").value()) {
                rolz.push(ele.name);
                rolidleri.push(ele.id);
            };
        });
        await mal.roles.remove(rolidleri);
        await mal.roles.add(roller.get("th-jail").value());
        if (!system) {
            try {
                let doggy = await jailed({ _id: mal.user.id, sebep: "KURAL DIŞI EYLEM - KICKLEME", executor: member.guild.owner.id, rolz: rolz, created: new Date() });
                await doggy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        };
        if (member.guild.member(mal).voice && member.guild.member(mal).voice.channel) member.guild.member(mal).voice.setChannel(null);
        //member.channel.send(`${emojis.jailed} ${mal} Başarıyla ${this.client.owner} tarafından cezalıya atıldı!`);
        const embedd = new Discord.MessageEmbed().setTitle(`Jaile Gönderildi`).setDescription(`${emojis.jailed} ${mal} kişisi ${this.client.owner} tarafından cezalıya atıldı`)
            .addField("Sebep:", "KURAL DIŞI EYLEM - KICKLEME", true).addField("Süre", `**Perma**`, true).setThumbnail(mal.user.displayAvatarURL({ dynamic: true }))
            .setAuthor("Koruma Sistemi", member.guild.iconURL({ dynamic: true }))
            .setFooter(`Tantoony Bots`).setTimestamp();
        member.guild.channels.cache.get(kanallar.get("cmd-jail").value()).send(embedd);
        const obje = {
            date: new Date(),
            type: `PermaJail`,
            executor: this.client.owner.id,
            reason: "KURAL DIŞI EYLEM - KICKLEME"
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
        let masum = logs.target;
        await kanalag.send(new Discord.MessageEmbed().setDescription(`${emojis.get("warn").value()} ${mal} sağ tık kullanarak ${masum} kişisini sunucudan attı!`));


    }
} 
