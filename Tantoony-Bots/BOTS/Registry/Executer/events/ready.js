const low = require('lowdb');
const wait = require('util').promisify(setTimeout);

module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(client) {

        client = this.client;

        const utiller = await low(this.client.adapters('utiller'));
        const guild = client.guilds.cache.get(utiller.get("sunucu").value());
        //client.logger.log(`Loading a total of ${client.commands.size} command(s).`, "load");
        client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");
        //client.autoUpdateDocs.update(client);
        client.user.setActivity(utiller.get('status').value()[0]);
        client.owner = client.users.cache.get('674565119161794560');
        await wait(1000);
        await guild.fetchInvites().then(guildInvites => {
            client.invites[guild.id] = guildInvites;
        });
        await guild.fetchVanityData().then(async (res) => {
            utiller.update("urltotal", n => res.uses).write();
            console.log(res.uses);
        }).catch(console.error);


    }
}  
