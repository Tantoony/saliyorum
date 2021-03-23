const { checkDays, getPath, trstats } = require("./functionz");
const Discord = require('discord.js');
const low = require('lowdb');

module.exports = {

    temel(obj, tit, des) {
        const utiller = low(obj.client.adapters('utiller'));
        const temel = new Discord.MessageEmbed()
            .setAuthor(utiller.get("embed.başlık").value(), utiller.get("tantoony").value())
            .setTitle(tit)
            .setDescription(des)
            .setFooter(`${utiller.get("embed.tarih").value()} | ${new Date(Date.now()).getUTCDate() + 1}.${new Date(Date.now()).getUTCMonth() + 1}.${new Date(Date.now()).getUTCFullYear()}`, obj.user.displayAvatarURL())
            .setColor("#2f3136")
        return temel;
    },
    hgmesaj(member, durum) {
        const utiller = low(member.client.adapters('utiller'));
        let embed = new Discord.MessageEmbed()
            .setAuthor(utiller.get("embed.başlık").value(), utiller.get("tantoony").value())
            .setFooter(`${utiller.get("embed.tarih").value()} | ${new Date(Date.now()).getUTCDate() + 1}.${new Date(Date.now()).getUTCMonth() + 1}.${new Date(Date.now()).getUTCFullYear()}`, member.user.displayAvatarURL())
            .setColor("#2f3136")
            .setTitle("Sunucuya Katıldı!")
            .addField("Oluşturulma tarihi: ", member.user.createdAt.toUTCString().substr(0, 16), true)
            .addField("Kullanıcı Adı:", member.user.username, true)
            .addField("Discriminator:", member.user.discriminator, true)
            .addField("\u200B", "\u200B", false)
            .addField("ID:", member.user.id, true)
            .addField("Kullanıcı:", durum, true)
            .addField("Durumu:", trstats(member.user.presence.status), true)
            .setDescription(`${member} sunucumuza katıldı!`)
            .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
        return embed;
    }
}  