const { checkDays, getPath } = require("./functionz");
const { temel } = require("./embedTemel");

module.exports = {

    tailor(message, target, rol) {
        let embedsex = temel(message, "Tailor Logs", `${target} üyesine bir rol verdim!`)
            .addField("Komutu kullanan: ", message.member, true)
            .addField("Kullanıcı:", target, true)
            .addField("Verilen rol: ", rol, true)
            .setThumbnail(target.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
        return embedsex
    },

    registry(message, target, isim) {
        let embedz = temel(message, "DoorMan Logs", `${target} sunucumuzda onaylandı!`)
            .addField("Oluşturulma tarihi:", target.user.createdAt.toUTCString().substr(0, 16), true)
            .addField("Kullanıcı:", target.user.tag, true)
            .addField("Katılma Süresi:", checkDays(target.joinedAt), true)
            .addField("\u200B", "\u200B", false)
            .addField("ID:", target.user.id, true)
            .addField("Onaylayan:", message.member, true)
            .addField("İsim | Yaş:", isim, true)
            .setThumbnail(target.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
        return embedz;
    },

    exiler(message, target, sebep) {

        var sakso = temel(message, "Exiler Logs", `${target} (id: ${target.user.id}) başarıyla banlandı!`)
            .addField("Komutu kullanan: ", message.member, true)
            .addField("Kullanıcı:", target, true)
            .addField("Sebep: ", sebep, false)
            .setThumbnail(target.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
        return sakso;
    },

    jailor(message, target, sebep) {

        var sakslo = temel(message, "Jail Logs", `${target} artık cezalı!`)
            .addField("Komutu kullanan: ", message.member, true)
            .addField("Kullanıcı:", `${target} (${target.user.id})`, true)
            .addField("Sebep: ", sebep, false)
            .setThumbnail(target.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
        return sakslo;
    }

}  
