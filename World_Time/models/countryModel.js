const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    'Name': {
        type: String,
        required: true
    },
    'Capital': {
        type: String,
        required: true
    },
    'ReqAddress': {
        type: String,
        required: true
    },
    'LocalTime': {
        type: String,
        required: true
    },
    'TimeOffset': {
        type: String,
        required: true
    },'Flag': {
        type: String,
        required: true
    },
}, { timestamps: true });

// actual table alias Model
const country = mongoose.model('country', countrySchema);

module.exports = country;