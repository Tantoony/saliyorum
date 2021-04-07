const path = require("path");

module.exports = class Command {
  constructor(client, {
    name = null,
    description = "Açıklama Belirtilmemiş.",
    usage = "Kullanım Belirtilmemiş.",
    examples = ["Örnek Bulunmamakta"],
    dirname = false,
    category = "Bulunamadı",
    aliases = ["\`-Eşdeğer Bulunamadı-\`"],
    permLvl = new Array,
    cmdChannel = null,
    cooldown = 5000,
    enabled = true,
    adminOnly = false,
    ownerOnly = false,
    onTest = true,
    rootOnly = false,
    kkvOnly = false,
    dmCmd = false
  }) {
    this.client = client;
    this.help = {
      name,
      description,
      usage,
      examples
    };
    this.info = {
      category,
      aliases,
      permLvl,
      cmdChannel,
      cooldown
    };
    this.conf = {
      dirname,
      enabled,
      adminOnly,
      ownerOnly,
      onTest,
      rootOnly,
      kkvOnly,
      dmCmd
    }
  }
};
