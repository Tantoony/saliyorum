const Discord = require("discord.js");
const { oneLine, stripIndents } = require("common-tags");
const { checkDays, rain, trstats, closeall } = require("../helpers/functionz");
const { temel, hgmesaj } = require("../helpers/embedTemel");
const low = require('lowdb');
const namedata = require("../../../../MODELS/nameData");
const invitez = require("../../../../MODELS/invites");
const cmutes = require("../../../../MODELS/cmutes");
const jailed = require('../../../../MODELS/permajails');
const tjailed = require('../../../../MODELS/tempjails');
const sicil = require('../../../../MODELS/sicil');
const dutyreg = require("../../../../MODELS/duty_davet");
const duties = require("../../../../MODELS/userXp");
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
        if (member.guild.id !== utiller.get("sunucu").value()) return;
        let audits = await member.guild.fetchAuditLogs({
            type: "BOT_ADD"
        });
        var log = audits.entries.first();
        const yetkili = member.guild.roles.cache.get(roller.get("cmd-registry").value());
        const kanal = member.guild.channels.cache.get(kanallar.get("gk-welcome").value());
        const lokal = member.guild.channels.cache.get(kanallar.get("gk-uyarı").value());
        const suphe = member.guild.channels.cache.get(kanallar.get("gk-şüphe").value());
        const gelensys = member.guild.channels.cache.get(kanallar.get("gk-gelen").value());
        const cezasys = member.guild.channels.cache.get(kanallar.get("gk-cezasys").value());


        if (member.user.bot) {
            const mal = member.guild.members.cache.get(log.executor.id);
            if (utiller.get("kkv").value().includes(log.executor.id) && mal.roles.cache.has(roller.get("root").value())) {
                lokal.send(new Discord.MessageEmbed().setDescription(`${emojis.get("idea").value()} ${member} botu ${log.executor} tarafından başarıyla eklendi!`));
                await member.roles.add([roller.get("th-bot").value()]);
                return;
            };
            closeall(member.guild, ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
            member.kick("Protected");
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
                    let doggy = await jailed({ _id: mal.user.id, sebep: "KURAL DIŞI EYLEM - BOT EKLEME", executor: member.guild.owner.id, rolz: rolz, created: new Date() });
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
                .addField("Sebep:", "KURAL DIŞI EYLEM - BOT EKLEME", true).addField("Süre", `**Perma**`, true).setThumbnail(mal.user.displayAvatarURL({ dynamic: true }))
                .setAuthor("Koruma Sistemi", member.guild.iconURL({ dynamic: true }))
                .setFooter(`Tantoony Bots`).setTimestamp();
            member.guild.channels.cache.get(kanallar.get("cmd-jail").value()).send(embedd);
            const obje = {
                date: new Date(),
                type: `PermaJail`,
                executor: this.client.owner.id,
                reason: "KURAL DIŞI EYLEM - BOT EKLEME"
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
            await lokal.send(new Discord.MessageEmbed().setDescription(`${emojis.get("warn").value()} ${log.executor} Sunucuya ${member} botunu eklemeye çalıştı..`));
            return;
        }

        const invitess = client.invites;
        let asdnumber;
        await member.guild.fetchVanityData().then(async (res) => {
            asdnumber = res.uses || 0;
        }).catch(console.error);

        let davetçi;
        let dosya;
        let invarray = [];
        let dosyacık = 0;

        await member.guild.fetchInvites().then(async guildInvites => {
            const ei = invitess[member.guild.id];
            if (utiller.get("urltotal").value() < asdnumber) {
                await member.guild.fetchVanityData().then(async (res) => {
                    await utiller.update("urltotal", n => res.uses).write();
                }).catch(console.error);
                console.log("VURL");
            } else {
                const invite = guildInvites.find(invitess => ei.get(invitess.code).uses < invitess.uses);
                if (invite) {
                    try {
                        davetçi = invite.inviter;
                    } catch (error) {
                        console.log(error);
                    };
                    const shem = {
                        invited: member.user.id,
                        created: new Date()
                    }
                    invarray.push(shem);
                    let systeminv = await invitez.findOne({ _id: davetçi.id });
                    if (!systeminv) {
                        try {
                            let sex = await invitez({ _id: davetçi.id, invites: invarray });
                            await sex.save();
                        } catch (error) {
                            throw error;
                        }
                        dosya = invarray;
                        dosyacık = 1;
                    } else {
                        dosya = systeminv.get("invites");
                        dosyacık = dosya.length;
                        if (!dosya.some(dos => dos.invited === member.user.id)) {
                            await invitez.updateOne({ _id: davetçi.id }, { $push: { invites: shem } });
                            dosyacık = dosya.length + 1;
                        };

                        let ecrin = await dutyreg.findOne({ _id: davetçi.id });
                        if (ecrin) {
                            if (checkDays(ecrin.created) > ecrin.expiresIn) await dutyreg.deleteOne({ _id: davetçi.id });
                            await dutyreg.updateOne({ _id: davetçi.id }, { $inc: { processx: 1 } });
                            ecrin = await dutyreg.findOne({ _id: davetçi.id });
                            if (ecrin.count === ecrin.processx) await dutyreg.deleteOne({ _id: davetçi.id });
                            const shem = {
                                date: new Date(),
                                type: 'Davet',
                                count: ecrin.count
                            };
                            let lewanch = await duties.findOne({ _id: davetçi.id });
                            if (!lewanch) {
                                let laden = [];
                                laden.push(shem);
                                let sex = duties({ _id: davetçi.id, complated: laden });
                                await sex.save();
                            } else {
                                duties.updateOne({ _id: davetçi.id }, { $push: { complated: shem } });
                            };
                        };
                    };
                } else {
                    const bilinmeyen = ei.find(inv => !guildInvites.has(inv.code));
                    try {
                        davetçi = bilinmeyen.inviter;
                    } catch (error) {
                        console.log(error);
                    };
                    const shem = {
                        invited: member.user.id,
                        created: new Date()
                    };
                    invarray.push(shem);
                    let systeminv = await invitez.findOne({ _id: davetçi.id });
                    if (!systeminv) {
                        try {
                            let sex = await invitez({ _id: davetçi.id, invites: invarray });
                            await sex.save();
                        } catch (error) {
                            throw error;
                        }
                        dosya = invarray;
                        dosyacık = 1;
                    } else {
                        dosya = systeminv.get("invites");
                        dosyacık = dosya.length;
                        if (!dosya.some(dos => dos.invited === member.user.id)) {
                            await invitez.updateOne({ _id: davetçi.id }, { $push: { invites: shem } });
                            dosyacık = dosya.length + 1;
                        };

                        let ecrin = await dutyreg.findOne({ _id: davetçi.id });
                        if (ecrin) {
                            if (checkDays(ecrin.created) > ecrin.expiresIn) await dutyreg.deleteOne({ _id: davetçi.id });
                            await dutyreg.updateOne({ _id: davetçi.id }, { $inc: { processx: 1 } });
                            ecrin = await dutyreg.findOne({ _id: davetçi.id });
                            if (ecrin.count === ecrin.processx) await dutyreg.deleteOne({ _id: davetçi.id });
                            const shem = {
                                date: new Date(),
                                type: 'Davet',
                                count: ecrin.count
                            };
                            let lewanch = await duties.findOne({ _id: davetçi.id });
                            if (!lewanch) {
                                let laden = [];
                                laden.push(shem);
                                let sex = duties({ _id: davetçi.id, complated: laden });
                                await sex.save();
                            } else {
                                duties.updateOne({ _id: davetçi.id }, { $push: { complated: shem } });
                            };
                        }
                    };
                }
            };
        });

        await member.guild.fetchInvites().then(guildInvites => {
            client.invites[member.guild.id] = guildInvites;
        });

        const nevcomer = await member.guild.roles.cache.get(roller.get("yeni").value());

        let yasaklılar = utiller.get("yasaklıtag").value();
        if (yasaklılar.some(tag => member.user.username.includes(tag))) {
            await gelensys.send(hgmesaj(member, "YASAKLI " + emojis.get("yasaklı").value()).setColor('#8b3032'));
            await member.roles.add(roller.get("yasaklı").value());
        } else if (checkDays(member.user.createdAt) < 7) {
            gelensys.send(hgmesaj(member, "ŞÜPHELİ " + emojis.get("şüpheli").value()).setColor('#8b3084'));
            member.roles.add(roller.get("şüpheli").value());
            suphe.send(`Aramıza Hoş Geldin ${member}. İçeriye girebilmen için ${rain(7 - checkDays(member.user.createdAt))} gün beklemen lazım..`);
        } else {
            const bela = await jailed.findOne({ _id: member.user.id });
            const belam = await tjailed.findOne({ _id: member.user.id });
            if (!bela && !belam) {
                const memberDoc = await namedata.findOne({ _id: member.user.id });
                if (memberDoc) {
                    if (memberDoc.sex === 'Male') await member.roles.add([roller.get("erkek").value(), roller.get("erkeki").value(), roller.get("member").value(), roller.get("memberi").value()]);
                    if (memberDoc.sex === 'Female') await member.roles.add([roller.get("kız").value(), roller.get("kızi").value(), roller.get("member").value(), roller.get("memberi").value()]);
                    if (memberDoc.sex === 'Lgbt') await member.roles.add([roller.get("lgbt").value(), roller.get("member").value()]);
                    let anan = "•";
                    if (member.user.username.includes(utiller.get("tag").value())) {
                        anan = utiller.get("tag").value();
                        await member.roles.add(roller.get("th-taglı").value());
                    };
                    await member.setNickname(`${anan} ${memberDoc.isim} | ${memberDoc.yaş}`);
                    return gelensys.send(hgmesaj(member, "GÜVENLİ\n(Önceden Kayıtlı) " + emojis.get("onaylı").value()).setColor('#308b49'))
                };

                member.roles.add(nevcomer);
                let coount = 0;
                let kimmişo;
                if (davetçi) {
                    coount = dosyacık;
                    kimmişo = davetçi.username;
                } else {
                    kimmişo = "Özel URL";
                    coount = utiller.get("urltotal").value();
                }
                //member = await member;
                kanal.send(new Discord.MessageEmbed()
                    .setAuthor("Hoş Geldin", member.guild.iconURL())
                    .setColor("#2f3136")
                    .setTitle(member.guild.name)
                    .setFooter(`20 Şubat 2020'den İtibaren... | ${new Date(Date.now()).getUTCDate()}.${new Date(Date.now()).getUTCMonth() + 1}.${new Date(Date.now()).getUTCFullYear()}`, client.user.displayAvatarURL())
                    .setDescription(
                        stripIndents`
                        
                     ${emojis.get("hgembed5").value()} **${member.user.username}** Aramıza Katıldı!

                     ${emojis.get("beraber").value()} Seninle Beraber **${rain(member.guild.memberCount)}** Kişiyiz.

                     ${emojis.get("hexagon").value()} Seni Davet Eden Kişi: **${kimmişo}** [\`Davet Sayısı: ${coount}\`]

                     ${emojis.get("countdown").value()} **Hesap:** ${rain(checkDays(member.user.createdAt))} Gün Önce Açılmıştır.
                     
                     ${emojis.get("hgembed6").value()} Kayıt Olmak İçin ${yetkili} Rolündeki Yetkilileri Etiketleyerek Ses Teyit Odasına Geçiniz!
                    
                    `)
                    //.setImage(utiller.get("welcome").value())
                    .setThumbnail(member.user.displayAvatarURL())
                );
                gelensys.send(hgmesaj(member, "GÜVENLİ " + emojis.get("onaylı").value()).setColor('#308b49'));
                //client.channels.cache.get(kanallar.get("bildirim").value()).send(`${yetkili} arkadaşların dikkatine! ${member} aramıza katıldı`);
                const belaa = await cmutes.findOne({ _id: member.id });
                if (!belaa) return;
                setTimeout(() => {
                    member.roles.add(roller.get("muted").value());
                }, 1000);
            } else {
                const memberDoc = await namedata.findOne({ _id: member.user.id });
                if (memberDoc) {
                    let anan = "•";
                    if (member.user.username.includes(utiller.get("tag").value())) {
                        anan = utiller.get("tag").value();
                        member.roles.add(roller.get("th-taglı").value());
                    };
                    member.setNickname(`${anan} ${memberDoc.isim} | ${memberDoc.yaş}`);
                };
                member.roles.add(roller.get("th-jail").value());
                cezasys.send(hgmesaj(member, "CEZALI " + emojis.get("cezalı").value()).setColor('#000001'));
                gelensys.send(`Tekrar hoş geldin ${member}\nSunucuya erişimin ${bela.sebep} sebebiyle kısıtlanmıştır...`);
            };
        };

    };
}

