const mongoose = require('mongoose');
const cmutes = mongoose.Schema({
    _id: String,
    sebep: String,
    muter: String,
    created: Date,
    süre: Number
}, {_id: false});
module.exports = mongoose.model('cmutes', cmutes);
