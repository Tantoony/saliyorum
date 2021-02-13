const { Client, Collection } = require("discord.js"),
    util = require("util"),
    path = require("path");

const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');

class Tantoony extends Client {

    constructor(options) {
        super(options);
        this.config = require('../HELPERS/config');
        this.logger = require("../HELPERS/logger"); 
        this.wait = util.promisify(setTimeout);
        this.functions = require("../HELPERS/functions");

        this.autoUpdateDocs = require('../HELPERS/updater');
        this.adapters = file => new FileSync(`../../BASE/${file}.json`);
        this.adapterroles = new FileSync('../../BASE/roller.json');
        this.adapterchannels = new FileSync('../../BASE/kanallar.json');
        this.adapteremojis = new FileSync('../../BASE/emojiler.json');
        this.adapterutil = new FileSync('../../BASE/utiller.json');

        this.invites = new Object();

        this.databaseCache = {};
        this.databaseCache.users = new Collection();
        this.databaseCache.guilds = new Collection();
        this.databaseCache.members = new Collection();
    }

    loadCommand(commandPath, commandName) {
        try {
            const props = new (require(`../BOTS/Moderator/${commandPath}${path.sep}${commandName}`))(this);
            this.logger.log(`Loading Command: ${props.help.name}. 👌`, "load");
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach((alias) => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }

    async unloadCommand(commandPath, commandName) {
        let command;
        if (this.commands.has(commandName)) {
            command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) {
            command = this.commands.get(this.aliases.get(commandName));
        }
        if (!command) {
            return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        }
        if (command.shutdown) {
            await command.shutdown(this);
        }
        delete require.cache[require.resolve(`../BOTS/Moderator/${commandPath}${path.sep}${commandName}.js`)];
        return false;
    }

    async findOrCreateUser({ id: userID }, isLean) {
        return new Promise(async (resolve) => {
            if (this.databaseCache.users.get(userID)) {
                resolve(isLean ? this.databaseCache.users.get(userID).toJSON() : this.databaseCache.users.get(userID));
            } else {
                let userData = (isLean ? await this.usersData.findOne({ id: userID }).lean() : await this.usersData.findOne({ id: userID }));
                if (userData) {
                    resolve(userData);
                } else {
                    userData = new this.usersData({ id: userID });
                    await userData.save();
                    resolve((isLean ? userData.toJSON() : userData));
                }
                this.databaseCache.users.set(userID, userData);
            }
        });
    }

    async findOrCreateGuild({ id: guildID }, isLean) {
        return new Promise(async (resolve) => {
            if (this.databaseCache.guilds.get(guildID)) {
                resolve(isLean ? this.databaseCache.guilds.get(guildID).toJSON() : this.databaseCache.guilds.get(guildID));
            } else {
                let guildData = (isLean ? await this.guildsData.findOne({ id: guildID }).populate("members").lean() : await this.guildsData.findOne({ id: guildID }).populate("members"));
                if (guildData) {
                    resolve(guildData);
                } else {
                    guildData = new this.guildsData({ id: guildID });
                    await guildData.save();
                    resolve(isLean ? guildData.toJSON() : guildData);
                }
                this.databaseCache.guilds.set(guildID, guildData);
            }
        });
    }

    async resolveUser(search) {
        let user = null;
        if (!search || typeof search !== "string") return;
        if (search.match(/^<@!?(\d+)>$/)) {
            let id = search.match(/^<@!?(\d+)>$/)[1];
            user = this.users.fetch(id).catch((err) => { });
            if (user) return user;
        }
        if (search.match(/^!?(\w+)#(\d+)$/)) {
            let username = search.match(/^!?(\w+)#(\d+)$/)[0];
            let discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
            user = this.users.find((u) => u.username === username && u.discriminator === discriminator);
            if (user) return user;
        }
        user = await this.users.fetch(search).catch(() => { });
        return user;
    }

    async resolveMember(search, guild) {
        let member = null;
        if (!search || typeof search !== "string") return;
        if (search.match(/^<@!?(\d+)>$/)) {
            let id = search.match(/^<@!?(\d+)>$/)[1];
            member = await guild.members.fetch(id).catch(() => { });
            if (member) return member;
        }
        if (search.match(/^!?(\w+)#(\d+)$/)) {
            guild = await guild.fetch();
            member = guild.members.find((m) => m.user.tag === search);
            if (member) return member;
        }
        member = await guild.members.fetch(search).catch(() => { });
        return member;
    }

    async resolveRole(search, guild) {
        let role = null;
        if (!search || typeof search !== "string") return;
        if (search.match(/^<@&!?(\d+)>$/)) {
            let id = search.match(/^<@&!?(\d+)>$/)[1];
            role = guild.roles.get(id);
            if (role) return role;
        }
        role = guild.roles.find((r) => search === r.name);
        if (role) return role;
        role = guild.roles.get(search);
        return role;
    }
    
    async kanalbul(kanal) {
        const adapterchannels = this.adapterchannels;
        const kanallar = low(adapterchannels);

        var sonuc = kanallar.get(kanal).value();
        console.log(sonuc);

        return sonuc;

    }

    async rolbul(rol) {
        const adapterroles = this.adapterroles;
        const roller = low(adapterroles);

        var sonuc = roller.get(rol).value();
        console.log(sonuc);

        return sonuc;

    }

}

module.exports = Tantoony;