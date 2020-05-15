const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let statesSchema = new Schema({
    states: [String]
})

module.exports = mongoose.model('statesSchema', statesSchema);