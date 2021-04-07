const { Client, Collection } = require("discord.js"),
    util = require("util"),
    path = require("path");

const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');
class Tantoony extends Client {

    constructor(options) {
        super(options);
        this.config = require("../../../../BASE/config"); 
        this.commands = new Collection(); 
        this.aliases = new Collection();
        this.logger = require("../helpers/logger"); 
        this.wait = util.promisify(setTimeout); 
        this.functions = require("../helpers/functions"); 

        this.adapterroles = new FileSync('../../BASE/roller.json');
        this.adapterchannels = new FileSync('../../BASE/kanallar.json');
        this.adapteremojis = new FileSync('../../BASE/emojiler.json');
        this.adapterutil = new FileSync('../../BASE/utiller.json');
        this.cmdCooldown = new Object();
        
        this.musicone = new Client();
        this.musictwo = new Client();
        this.musictre = new Client();
        this.musicfor = new Client();
        this.musicfve = new Client();
        this.bots = [
            this.musicone,
            this.musictwo,
            this.musictre,
            this.musicfor,
            this.musicfve
        ];
        this.databaseCache = {};
        this.databaseCache.users = new Collection();
        this.databaseCache.guilds = new Collection();
        this.databaseCache.members = new Collection();
    }
    loadCommand(commandPath, commandName) {
        try {
            const props = new (require(`../../${commandPath}${path.sep}${commandName}`))(this);
            this.logger.log(`Loading Command: ${props.help.name}. 👌`, "load");
            props.conf.location = commandPath;
            props.conf.dirname = commandPath.split("/").slice(3)[0];
            if (props.init) {
                props.init();
            }
            this.commands.set(props.help.name, props);
            props.info.aliases.forEach((alias) => {
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
        delete require.cache[require.resolve(`../../${commandPath}${path.sep}${commandName}.js`)];
        return false;
    }

}

module.exports = Tantoony;
