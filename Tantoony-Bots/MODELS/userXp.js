const Mongoose = require("mongoose");
const userXp = new Mongoose.Schema({
    _id: String,
    complated: new Array()
}, {_id: false});
module.exports = Mongoose.model('UserXp', userXp);
