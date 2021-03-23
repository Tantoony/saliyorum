const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const salan = require('../../../../MODELS/salan');

module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async give(member) {
        const adapterroles = new FileSync('../../BASE/roller.json');
        const roller = low(adapterroles);
        let rolz = [];
        let rolidleri = [];
        let system = await salan.findOne({ _id: member.user.id });
        if (!system) {
            await member.roles.cache.forEach(async (ele) => {
                if (ele.id !== roller.get("th-booster").value()) {
                    //if (ele.rawPosition > member.guild.roles.cache.get(roller.get("jaillimit").value()).rawPosition)
                    rolz.push(ele.name);
                    rolidleri.push(ele.id);
                };
            });
            try {
                let doggy = await salan({ _id: member.user.id, rolz: rolz });
                await doggy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        };
        await member.roles.remove(rolidleri);
        await member.roles.add(roller.get("yeni").value());
    };

    async take(member) {
        const adapterroles = new FileSync('../../BASE/roller.json');
        const roller = low(adapterroles);
        await member.roles.remove(roller.get("yeni").value());
        let dog = await salan.findOne({ _id: member.user.id });
        let salakmısın = dog.get("rolz");
        //console.log(salakmısın);
        let yaratık = [];
        salakmısın.forEach(ele => {
            let anancı = member.guild.roles.cache.find(r => r.name === ele);
            yaratık.push(anancı.id);
        });
        member.roles.add(yaratık);
        await salan.deleteOne({ _id: member.user.id });
    };

    async kayıt(member) {
        const adapterroles = new FileSync('../../BASE/roller.json');
        const roller = low(adapterroles);
        let rolidleri = [];
        await member.roles.cache.forEach(async (ele) => {
            if (ele.id !== roller.get("th-booster").value()) {
                rolidleri.push(ele.id);
            };
        });
        await member.roles.remove(rolidleri);
        await member.roles.add(roller.get("yeni").value());
    };

}  