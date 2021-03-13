const mongoose = require('mongoose');
const PunishmentData = mongoose.Schema({
    _id: String,
    punishes: new Array(),
}, {_id: false});
module.exports = mongoose.model('PunishmentData', PunishmentData);
