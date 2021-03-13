const mongoose = require('mongoose');
const MemberData = mongoose.Schema({
    _id: String,
    isim: String,
    yaş: String,
    sex: String,
    date: Date,
    exe: String
}, {_id: false});
module.exports = mongoose.model('MemberData', MemberData);
