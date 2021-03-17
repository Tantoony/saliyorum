const { bgBlue, black, green } = require("chalk");

function dateTimePad(value, digits) {
  let number = value
  while (number.toString().length < digits) {
    number = "0" + number
  }
  return number;
}

function format(tDate) {
  return (tDate.getFullYear() + "-" +
    dateTimePad((tDate.getMonth() + 1), 2) + "-" +
    dateTimePad(tDate.getDate(), 2) + " " +
    dateTimePad(tDate.getHours(), 2) + ":" +
    dateTimePad(tDate.getMinutes(), 2) + ":" +
    dateTimePad(tDate.getSeconds(), 2) + "." +
    dateTimePad(tDate.getMilliseconds(), 3))
}

module.exports = class Logger {
  static log (content, type = "log") {
    const date = `[${format(new Date(Date.now()))}]:`;
    switch (type) {
      case "log": {
        return console.log(`${date} ${bgBlue(type.toUpperCase())} ${content} `);
      }
      case "warn": {
        return console.log(`${date} ${black.bgHex('#D9A384')(type.toUpperCase())} ${content} `);
      }
      case "error": {
        return console.log(`${date} ${black.bgHex('#FF0000')(type.toUpperCase())} ${content} `);
      }
      case "debug": {
        return console.log(`${date} ${green(type.toUpperCase())} ${content} `);
      }
      case "cmd": {
        return console.log(`${date} ${black.bgHex('#8dbe85')(type.toUpperCase())} ${content}`);
      }
      case "ready": {
        return console.log(`${date} ${black.bgHex('#48D09B')(type.toUpperCase())} ${content}`);
      } 
      case "complete": {
        return console.log(`${date} ${black.bgHex('#CCFFCC')(type.toUpperCase())} ${content}`);
      }
      case "docs": {
        return console.log(`${date} ${black.bgHex('#A9D4D9')(type.toUpperCase())} ${content}`);
      }
      case "mngdb": {
        return console.log(`${date} ${black.bgHex('#F9D342')(type.toUpperCase())} ${content}`);
      }
      case "reconnecting": {
        return console.log(`${date} ${black.bgHex('#133729')(type.toUpperCase())} ${content}`);
      }
      case "disconnecting": {
        return console.log(`${date} ${black.bgHex('#782020')(type.toUpperCase())} ${content}`);
      }
      case "load": {
        return console.log(`${date} ${black.bgHex('#7B78B4')(type.toUpperCase())} ${content}`);
      }
      case "varn": {
        return console.log(`${date} ${black.bgHex('#EEA2AD')(type.toUpperCase())} ${content}`);
      }
      case "caution": {
        return console.log(`${date} ${black.bgHex('#FF0000')(type.toUpperCase())} ${content}`);
      }
      case "category": {
        return console.log(`${date} ${black.bgHex('#E8D4A9')(type.toUpperCase())} ${content}`);
      }
      default: throw new TypeError("Bir log çeşidi belirtilmemiş..");
    }
  }
};
