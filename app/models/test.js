const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = Schema({
    image: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('test', testSchema);