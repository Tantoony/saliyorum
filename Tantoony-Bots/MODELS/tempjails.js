const mongoose = require('mongoose');
const jailed = mongoose.Schema({
    _id: String,
    sebep: String,
    executor: String,
    rolz: new Array(),
    created: Date,
    süre: Number,
    birim: String
}, {_id: false});
module.exports = mongoose.model('jailed', jailed);
