const mongoose = require('mongoose');
const Invites = mongoose.Schema({
    _id: String,
    invites: new Array(),
}, {_id: false});
module.exports = mongoose.model('Invites', Invites);
