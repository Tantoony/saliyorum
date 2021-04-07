const util = require("util");
const fs = require("fs");
const readdir = util.promisify(fs.readdir);
const mongoose = require("mongoose");
const { Intents } = require('discord.js');
const Tantoony = require('./inventory/base/Tantoony');
const client = new Tantoony({
    ws: {
        intents: new Intents(Intents.ALL).remove([
            "GUILD_INTEGRATIONS",
            "GUILD_BANS",
            "GUILD_EMOJIS",
            "GUILD_MESSAGE_TYPING",
            "DIRECT_MESSAGE_TYPING",
            "GUILD_WEBHOOKS",
            "GUILD_INVITES"
        ])
    }
});
const { config } = require("dotenv");
config({ path: __dirname + "./../../BASE/.env" });
client.login(process.env.Moderator);

const init = async () => {
    let directories = await readdir("./executer/commands/");
    client.logger.log(`Loading a total of ${directories.length} categories.`, "category");
    directories.forEach(async (dir) => {
        let commands = await readdir("./executer/commands/" + dir + "/");
        commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
            const response = client.loadCommand("./executer/commands/" + dir, cmd);
            if (response) {
                client.logger.log(response, "error");
            }
        });
    });
    const evtFiles = await readdir("./executer/events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`, "category");
    evtFiles.forEach((file) => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`, "load");
        const event = new (require(`./executer/events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./executer/events/${file}`)];
    });
    mongoose.connect(client.config.mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => {
        client.logger.log("Connected to the Mongodb database.", "mngdb");
    }).catch((err) => {
        client.logger.log("Unable to connect to the Mongodb database. Error: " + err, "error");
    });
};
init();
client.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
    .on("disconnect", () => client.logger.log("Bot is disconnecting...", "disconnecting"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "reconnecting"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));
process.on("unhandledRejection", (err) => { client.logger.log(err, "caution") });
process.on("warning", (warn) => { client.logger.log(warn, "varn") });
