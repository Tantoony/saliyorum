const Mongoose = require("mongoose");
const userXp = new Mongoose.Schema({
    _id: String,
    count: Number,
    created: Date,
    expiresIn: Number,
    processx: Number
}, {_id: false});
module.exports = Mongoose.model('DutyInv', userXp);
