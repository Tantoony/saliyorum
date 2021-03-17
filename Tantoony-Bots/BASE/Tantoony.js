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
        
        this.adapters = file => new FileSync(`../../BASE/${file}.json`);
        this.adapterroles = new FileSync('../../BASE/roller.json');
        this.adapterchannels = new FileSync('../../BASE/kanallar.json');
        this.adapteremojis = new FileSync('../../BASE/emojiler.json');
        this.adapterutil = new FileSync('../../BASE/utiller.json');

        this.invites = new Object();

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


}

module.exports = Tantoony;
