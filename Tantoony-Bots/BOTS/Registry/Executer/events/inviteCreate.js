const low = require('lowdb');

module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(invite) {


        const utiller = await low(this.client.adapters('utiller'));
        if (invite.guild.id !== utiller.get("sunucu").value()) return;
        await invite.guild.fetchInvites().then(guildInvites => {
            this.client.invites[invite.guild.id] = guildInvites;
        });
        await invite.guild.fetchVanityData().then(async (res) => {
            utiller.update("urltotal", n => res.uses).write();
            //console.log(res.uses);
        }).catch(console.error);
    }
}  
