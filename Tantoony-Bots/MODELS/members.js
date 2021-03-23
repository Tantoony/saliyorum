const mongoose = require('mongoose');
const Members = mongoose.Schema({
    _id: String,
    rol: new Array(),
}, {_id: false});

module.exports = mongoose.model('Members', Members);