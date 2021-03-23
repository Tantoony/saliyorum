const mongoose = require('mongoose');
const Salan = mongoose.Schema({
    _id: String,
    rolz: new Array(),
}, {_id: false});

module.exports = mongoose.model('Salan', Salan);