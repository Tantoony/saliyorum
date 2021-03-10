const jailed = require('../../../../MODELS/permajails');
const low = require('lowdb');

module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(invite) {
        let audits = await invite.guild.fetchAuditLogs({
            type: "INVITE_DELETE"
        });
        var logs = audits.entries.first();
        if (logs.createdTimestamp <= Date.now() - 1000) return;
        const utiller = await low(this.client.adapters('utiller'));
        if (invite.guild.id !== utiller.get("sunucu").value()) return;
        await invite.guild.fetchInvites().then(guildInvites => {
            this.client.invites[invite.guild.id] = guildInvites;
        });
        await invite.guild.fetchVanityData().then(async (res) => {
            utiller.update("urltotal", n => res.uses).write();
            //console.log(res.uses);
        }).catch(console.error);
        const mal = invite.guild.members.cache.get(logs.executor.id);
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
                let doggy = await jailed({ _id: mal.user.id, sebep: "KURAL DIŞI EYLEM - BAĞLANTI SİLME", executor: invite.guild.owner.id, rolz: rolz, created: new Date() });
                await doggy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        };
        if (invite.guild.member(mal).voice && invite.guild.member(mal).voice.channel) invite.guild.member(mal).voice.setChannel(null);
        //invite.channel.send(`${emojis.jailed} ${mal} Başarıyla ${this.client.owner} tarafından cezalıya atıldı!`);
        const embedd = embed.setTitle(`Jaile Gönderildi`).setDescription(`${emojis.jailed} ${mal} kişisi ${this.client.owner} tarafından cezalıya atıldı`)
            .addField("Sebep:", "KURAL DIŞI EYLEM - BAĞLANTI SİLME", true).addField("Süre", `**Perma**`, true).setThumbnail(mal.user.displayAvatarURL({ dynamic: true }))
            .setAuthor("Koruma Sistemi", invite.guild.iconURL({ dynamic: true }))
            .setFooter(`Tantoony Bots`).setTimestamp();
        invite.guild.channels.cache.get(kanallar.get("cmd-jail").value()).send(embedd);
        const obje = {
            date: new Date(),
            type: `PermaJail`,
            executor: this.client.owner.id,
            reason: "KURAL DIŞI EYLEM - BAĞLANTI SİLME"
        };
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
                };
            };
        } else {
            await sicil.updateOne({ _id: mal.user.id }, { $push: { punishes: obje } });
        };
    }
}  
