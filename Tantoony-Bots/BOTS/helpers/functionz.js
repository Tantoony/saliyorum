const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

module.exports = {

    rain(sayi) {
        const adapteremojis = new FileSync('../../BASE/emojiler.json');
        const emojis = low(adapteremojis).get("numbers").value();
        var basamakbir = sayi.toString().replace(/ /g, "     ");
        var basamakiki = basamakbir.match(/([0-9])/g);
        basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
        if (basamakiki) {
            basamakbir = basamakbir.replace(/([0-9])/g, d => {
                return {
                    "0": emojis.sfr,
                    "1": emojis.bir,
                    "2": emojis.iki,
                    "3": emojis.uch,
                    "4": emojis.drt,
                    "5": emojis.bes,
                    "6": emojis.alt,
                    "7": emojis.ydi,
                    "8": emojis.sks,
                    "9": emojis.dkz
                }[d];
            });
        }
        return basamakbir;
    },

    checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days;
    },

    getPath(obj, value, path) {

        if (typeof obj !== 'object') {
            return;
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                //console.log(key);
                var t = path;
                var v = obj[key];
                if (!path) {
                    path = key;
                }
                else {
                    path = path + '.' + key;
                }
                if (v === value) {
                    return path.toString();
                }
                else if (typeof v !== 'object') {
                    path = t;
                }
            }
        }

    },

    async closeall(obj, permes) {
        if (obj !== "Guild") obj = obj.guild;
        obj.roles.cache.filter(rol => rol.editable).filter(rol => permes.some(xd => rol.permissions.has(xd))).forEach(async (rol) => rol.setPermissions(0));  
    },

    trstats(word) {
        let gotkokuyor = "";
        if (word === 'dnd') {
            gotkokuyor = 'Rahatsız Etmeyin';
        } else if (word === 'online') {
            gotkokuyor = "Çevrimiçi";
        } else if (word === 'idle') {
            gotkokuyor = 'Boşta';
        } else {
            gotkokuyor = 'Çevrimdışı';
        }

        return gotkokuyor;
    }

};
