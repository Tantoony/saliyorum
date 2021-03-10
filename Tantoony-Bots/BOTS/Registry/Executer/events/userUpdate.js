const low = require('lowdb');
const taglı = require('../helpers/taglialim');
const { stripIndents } = require('common-tags');
const { temel } = require('../helpers/embedTemel');
const salan = require('../../../../MODELS/salan');
const jailed = require('../../../../MODELS/permajails');
const sicil = require('../../../../MODELS/sicil');

module.exports = class {

    constructor(client) {
        this.client = client;

    }

    async run(oldUser, newUser) {

        const client = this.client;

        const roller = await low(this.client.adapters('roller'));
        const kanallar = await low(this.client.adapters('kanallar'));
        const utiller = await low(this.client.adapters('utiller'));
        const emojiler = await low(this.client.adapters('emojiler'));

        const tag = utiller.get("tag").value();

        const guidle = client.guilds.cache.get(utiller.get("sunucu").value());
        const kanalalım = guidle.channels.cache.get(kanallar.get("genel").value());
        const kanalverim = guidle.channels.cache.get(kanallar.get("gk-tag").value());
        const tagrol = guidle.roles.cache.get(roller.get("th-taglı").value());
        const tagroli = guidle.roles.cache.get(roller.get("th-taglıi").value());
        const sexiboy = guidle.members.cache.get(newUser.id);

        if (oldUser.username !== newUser.username) {
            /*
            if (sexiboy.roles.cache.some(r => r.id === config.serverset.roller.temel.nevcomer)) {

                if (newUser.username.includes(tag) && !sexiboy.roles.cache.some(r => r.id === config.serverset.roller.temel.tag)) {

                    var isim = sexiboy.displayName;
                    isim = isim.replace(tag, "•");
                    kanalverim.send(`${newUser} tagımızı aldı!`);
                    return sexiboy.setNickname(isim);

                };
                if (!newUser.username.includes(tag) && sexiboy.roles.cache.some(r => r.id === config.serverset.roller.temel.tag)) {
                    var nnn = sexiboy.displayName;
                    nnn = nnn.replace("•", tag);
                    kanalverim.send(`${newUser} tagımızı çıkardı!`);
                    return sexiboy.roles.remove(rol);

                };
            };
            */
            //console.log('sen');

            let yarak = utiller.get("yasaklıtag").value();
            if (yarak.some(tagy => newUser.username.includes(tagy))) {
                if (!sexiboy.roles.cache.has(roller.get("yasaklı").value())) {
                    let rolz = [];
                    let rolidleri = [];
                    let system = await jailed.findOne({ _id: sexiboy.user.id });
                    await sexiboy.roles.cache.forEach(async (ele) => {
                        if (ele.id !== roller.get("th-booster").value()) {
                            rolz.push(ele.name);
                            rolidleri.push(ele.id);
                        };
                    });
                    sexiboy.roles.remove(rolidleri);
                    sexiboy.roles.add(roller.get("th-jail").value());
                    if (!system) {
                        try {
                            let doggy = await jailed({ _id: sexiboy.user.id, sebep: "YASAKLI TAG", executor: member.guild.owner.id, rolz: rolz, created: new Date() });
                            await doggy.save();
                        } catch (error) {
                            if (error.code !== 5904) {
                                throw error;
                            }
                        }
                    };
                    if (message.guild.member(sexiboy).voice && message.guild.member(sexiboy).voice.channel) message.guild.member(sexiboy).voice.setChannel(null);
                    message.channel.send(`${emojis.jailed} ${sexiboy} Başarıyla ${this.client.owner} tarafından cezalıya atıldı!`);
                    const embedd = embed.setTitle(`Jaile Gönderildi`).setDescription(`${emojis.jailed} ${sexiboy} kişisi ${this.client.owner} tarafından cezalıya atıldı`)
                        .addField("Sebep:", "YASAKLI TAG", true).addField("Süre", `**Perma**`, true).setThumbnail(sexiboy.user.displayAvatarURL({ dynamic: true }))
                        .setAuthor("Koruma Sistemi", message.guild.iconURL({ dynamic: true }))
                    message.guild.channels.cache.get(kanallar.get("cmd-jail").value()).send(embedd);
                    const obje = {
                        date: new Date(),
                        type: `PermaJail`,
                        executor: this.client.owner.id,
                        reason: "YASAKLI TAG"
                    }
                    let invarray = [];
                    let gg = invarray.push(obje);
                    let systemm = await sicil.findOne({ _id: sexiboy.user.id });
                    if (!systemm) {
                        try {
                            let doffy = await sicil({ _id: sexiboy.user.id, punishes: gg });
                            await doffy.save();
                        } catch (error) {
                            if (error.code !== 5904) {
                                throw error;
                            }
                        }
                    } else {
                        await sicil.updateOne({ _id: sexiboy.user.id }, { $push: { punishes: obje } });
                    }
                    await sexiboy.roles.remove(roller.get("jail").value());
                    await sexiboy.send(stripIndents`Bu tarz bir konuyla ilgili seni bilgilendirmek istemezdim ancak, görünüşe göre sunucumuzda yasaklı olan bir tag kullanıyorsun.
                    Bundan dolayı sunucumuzun içerisine girişin kapatılmıştır. Eğer kullandığın tag'ı profilinden kaldırır isen tekrardan giriş sağlayabileceksin.
                    Seni seviyoruz tekrardan görüşmek dileğiyle.. -Reform YÖNETİM`);
                    return sexiboy.roles.add(roller.get("yasaklı").value());
                };
            };

            if (!yarak.some(tagy => newUser.username.includes(tagy))) {
                if (sexiboy.roles.cache.has(roller.get("yasaklı").value())) {
                    //console.log('f');
                    const doc = await jailed.findOne({ _id: sexiboy.user.id });
                    let salakmısın = doc.rolz;
                    let yaratık = [];
                    await salakmısın.forEach(ele => {
                        let anancı = member.guild.roles.cache.find(r => r.name === ele);
                        if (anancı && anancı.editable) yaratık.push(anancı.id);
                    });
                    sexiboy.roles.add(yaratık);
                    jailed.deleteOne({ _id: sexiboy.user.id });
                    sexiboy.roles.remove(roller.get("th-jail").value());
                    //message.channel.send(embed.setDescription(`${emojis.allowedmute} ${sexiboy} üyesinin metin kanallarındaki susturulması ${this.client.owner} tarafından kaldırıldı.`));
                    const embedd = embed.setTitle(`Ses Mute Atıldı`).setDescription(`${emojis.vmuted} ${sexiboy} kişisi ${this.client.owner} tarafından metin kanallarındaki susturulması kaldırıldı`)
                        .setAuthor("Koruma Sistemi", member.guild.iconURL({ dynamic: true }))
                        .setFooter(`Tantoony Bots`).setTimestamp();
                    //message.guild.channels.cache.get((await kanallar).get("cmd-jail").value()).send(embedd);
                    const obje = {
                        date: new Date(),
                        type: `PermaJail - KALDIRILDI`,
                        executor: this.client.owner.user.id,
                        reason: "YASAKLI TAG"
                    }
                    let invarray = [];
                    let gg = invarray.push(obje);
                    let systemm = await sicil.findOne({ _id: sexiboy.user.id });
                    if (!systemm) {
                        try {
                            let doffy = await sicil({ _id: sexiboy.user.id, punishes: gg });
                            await doffy.save();
                        } catch (error) {
                            if (error.code !== 5904) {
                                throw error;
                            }
                        }
                    } else {
                        await sicil.updateOne({ _id: sexiboy.user.id }, { $push: { punishes: obje } });
                    }
                    await sexiboy.send(stripIndents`Tekrardan Selam!
                    Görünüşe göre sunucumuzda yasaklı olan tag'ı kaldırdığını görüyorum, Tekrardan aramıza Hoş Geldin!`);
                    await sexiboy.roles.remove(roller.get("yasaklı").value());
                };
            };

            if (newUser.username.includes(tag) && !sexiboy.roles.cache.has(tagrol.id)) {
                await sexiboy.roles.add([tagrol, tagroli]);
                await sexiboy.setNickname(sexiboy.displayName.replace("•", tag));
                await kanalalım.send(`${emojiler.get("tag").value()} Sunucumuza olan sadakatin bizi onurlandırdı ${newUser} !\n**Bütün Ailemiz Selam Dursun!**`);
                let system = await salan.findOne({ _id: newUser.id });
                if (!system) {
                    //return;
                } else {
                    taglı.prototype.take(sexiboy);
                }
            };
            //console.log('anan');

            if (!newUser.username.includes(tag) && sexiboy.roles.cache.has(tagrol.id)) {
                await sexiboy.setNickname(sexiboy.displayName.replace(tag, "•"));
                await sexiboy.roles.cache.forEach(async (rol) => {
                    if (rol.id === roller.get("th-booster").value()) return;
                    if (rol.rawPosition <= sexiboy.guild.roles.cache.get(roller.get("member").value()).rawPosition) return;
                    await sexiboy.roles.remove(rol.id)
                });
                await sexiboy.roles.remove([tagrol, tagroli]);
                await kanalverim.send(temel(sexiboy, "Tag Salan Birileri Var!", `${newUser} tagınımızı çıkardığı için taglı rolünü kaybetti!`));
                if (utiller.get("taglıalım").value()) {
                    if (sexiboy.roles.cache.has(roller.get("th-booster").value())) return;
                    await taglı.prototype.give(sexiboy);
                };
            };


        }


    }
}
