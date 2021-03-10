const modelz = require('../../../../MODELS/members');
const low = require('lowdb');
const jailed = require('../../../../MODELS/permajails');
const sicil = require('../../../../MODELS/sicil');
const names = require('../../../../MODELS/nameData');
module.exports = class {

    constructor(client) {
        this.client = client;

    }

    async run(oldMember, newMember) {

        const roller = low(this.client.adapters('roller'));
        const kanallar = low(this.client.adapters('kanallar'));
        const utiller = await low(this.client.adapters('utiller'));
        if (oldMember.roles.cache.has((await roller).get("th-booster").value()) && !newMember.roles.cache.has((await roller).get("th-booster").value())) {
            const system = names.findOne({ _id: newMember.user.id });
            if (!system) {
                await newMember.roles.remove([
                    (await roller).get("erkek").value(),
                    (await roller).get("kız").value(),
                    (await roller).get("erkeki").value(),
                    (await roller).get("kızi").value(),
                    (await roller).get("member").value(),
                    (await roller).get("memberi").value()
                ]);
                await newMember.roles.add((await roller).get("yeni").value());
                return;
            } else {
                let anan = '';
                if (newMember.user.username.includes((await utiller).get("tag").value())) {
                    anan = utiller.get("tag").value();
                } else {
                    anan = '•';
                };
                await newMember.setNickname(`${anan} ${system.isim} | ${system.yaş}`);
                return;
            };
        };
        if (utiller.get("ohal").value()) return;
        var index = await newMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_ROLE_UPDATE',
        });

        let logs = index.entries.first();
        if (logs.createdTimestamp < (Date.now() - 5000)) return;
        const rolum = logs.changes[0].new[0].id;
        const guildrol = newMember.guild.roles.cache.get(rolum);
        const key = logs.changes[0].key;
        let id = newMember.user.id;
        let sexiboyz = [];
        await newMember.roles.cache.forEach(rol => sexiboyz.push(rol.name));
        if (logs.executor.bot) {

            let system = await modelz.findOne({ _id: id });
            if (!system) {
                try {
                    let sex = modelz({ _id: id, rol: sexiboyz });
                    sex.save();
                    //console.log('Değişim Oluşturuldu.');
                } catch (error) {
                    if (error.code !== 5904) {
                        throw error;
                    }
                }
            } else {
                if (!utiller.get("ohal").value()) {
                    (await modelz.findOneAndUpdate({ _id: id }, { rol: sexiboyz })).save();
                    this.client.logger.log(`${logs.target.id} ==> ${newMember.displayName}`, "mngdb");
                    if (!logs.executor.bot) console.log(`Değişim Yenilendi: ${logs.target.id} => ${logs.changes[0].new}`);
                };
            };
            return;
        };
        const yaraque = utiller.get("kkv").value();
        const mal = newMember.guild.members.cache.get(logs.executor.id);
        if (mal.roles.cache.has((await roller).get("root").value()) || mal.roles.cache.has((await roller).get("owner").value())) {
            let system = await modelz.findOne({ _id: id });
            if (!system) {
                try {
                    let sex = modelz({ _id: id, rol: sexiboyz });
                    sex.save();
                    //console.log('Değişim Oluşturuldu.');
                } catch (error) {
                    if (error.code !== 5904) {
                        throw error;
                    }
                }
            } else {
                if (!utiller.get("ohal").value()) {
                    (await modelz.findOneAndUpdate({ _id: id }, { rol: sexiboyz })).save();
                    this.client.logger.log(`${logs.target.id} ==> ${newMember.displayName}`, "mngdb");
                    if (!logs.executor.bot) console.log(`Değişim Yenilendi: ${logs.target.id} => ${logs.changes[0].new}`);
                };
            };
            return;
        };
        if (yaraque.some(biri => biri === logs.executor.id)) {
            let system = await modelz.findOne({ _id: id });
            if (!system) {
                try {
                    let sex = modelz({ _id: id, rol: sexiboyz });
                    sex.save();
                    //console.log('Değişim Oluşturuldu.');
                } catch (error) {
                    if (error.code !== 5904) {
                        throw error;
                    }
                }
            } else {
                if (!utiller.get("ohal").value()) {
                    (await modelz.findOneAndUpdate({ _id: id }, { rol: sexiboyz })).save();
                    this.client.logger.log(`${logs.target.id} ==> ${newMember.displayName}`, "mngdb");
                    if (!logs.executor.bot) console.log(`Değişim Yenilendi: ${logs.target.id} => ${logs.changes[0].new}`);
                };
            };
            return;
        };
        const rollerim = [
            (await roller).get("cmd-registry").value(),
            (await roller).get("cmd-muter").value(),
            (await roller).get("cmd-banner").value(),
            (await roller).get("cmd-jailor").value(),
            (await roller).get("cmd-manager").value(),
            (await roller).get("cmd-transport").value(),
            (await roller).get("cmd-ruby").value()
        ];
        const permler = ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"];
        if (rollerim.includes(rolum) && !logs.executor.bot && !mal.roles.cache.has((await roller).get("cmd-authority").value())) {
            newMember.roles.remove(rolum);
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
                    let doggy = await jailed({ _id: mal.user.id, sebep: "KURAL DIŞI EYLEM - ROL VERME", executor: member.guild.owner.id, rolz: rolz, created: new Date() });
                    await doggy.save();
                } catch (error) {
                    if (error.code !== 5904) {
                        throw error;
                    }
                }
            };
            if (member.guild.member(mal).voice && member.guild.member(mal).voice.channel) member.guild.member(mal).voice.setChannel(null);
            //member.channel.send(`${emojis.jailed} ${mal} Başarıyla ${this.client.owner} tarafından cezalıya atıldı!`);
            const embedd = embed.setTitle(`Jaile Gönderildi`).setDescription(`${emojis.jailed} ${mal} kişisi ${this.client.owner} tarafından cezalıya atıldı`)
                .addField("Sebep:", "KURAL DIŞI EYLEM - ROL VERME", true).addField("Süre", `**Perma**`, true).setThumbnail(mal.user.displayAvatarURL({ dynamic: true }))
                .setAuthor("Koruma Sistemi", member.guild.iconURL({ dynamic: true }))
                .setFooter(`Tantoony Bots`).setTimestamp();
            member.guild.channels.cache.get(kanallar.get("cmd-jail").value()).send(embedd);
            const obje = {
                date: new Date(),
                type: `PermaJail`,
                executor: this.client.owner.id,
                reason: "KURAL DIŞI EYLEM - ROL VERME"
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
        };
        if (permler.some(prm => guildrol.permissions.has(prm))) {
            newMember.roles.remove(rolum);
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
                    let doggy = await jailed({ _id: mal.user.id, sebep: "KURAL DIŞI EYLEM - ROL VERME", executor: member.guild.owner.id, rolz: rolz, created: new Date() });
                    await doggy.save();
                } catch (error) {
                    if (error.code !== 5904) {
                        throw error;
                    }
                }
            };
            if (member.guild.member(mal).voice && member.guild.member(mal).voice.channel) member.guild.member(mal).voice.setChannel(null);
            //member.channel.send(`${emojis.jailed} ${mal} Başarıyla ${this.client.owner} tarafından cezalıya atıldı!`);
            const embedd = embed.setTitle(`Jaile Gönderildi`).setDescription(`${emojis.jailed} ${mal} kişisi ${this.client.owner} tarafından cezalıya atıldı`)
                .addField("Sebep:", "KURAL DIŞI EYLEM - ROL VERME", true).addField("Süre", `**Perma**`, true).setThumbnail(mal.user.displayAvatarURL({ dynamic: true }))
                .setAuthor("Koruma Sistemi", member.guild.iconURL({ dynamic: true }))
                .setFooter(`Tantoony Bots`).setTimestamp();
            member.guild.channels.cache.get(kanallar.get("cmd-jail").value()).send(embedd);
            const obje = {
                date: new Date(),
                type: `PermaJail`,
                executor: this.client.owner.id,
                reason: "KURAL DIŞI EYLEM - ROL VERME"
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
        };

    }
} 
