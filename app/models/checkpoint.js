var mongoose = require('mongoose');

var checkpointSchema = mongoose.Schema({
    name: String,
    cars: [
        {
            'wp': Object,
            'p': Number,
            't': Number,
            'speed': Number
        }
    ],
    packets: [
        {
            "id": Number,
            "src": Number,
            "dest": Number,
            "life": Number,
            "baseDelay": Number,
            "delay": Number,
            "pos": Number,
            "lastPos": Number
        }
    ],
    dimensions: { 'x': Number, 'y': Number }
});
module.exports = mongoose.model('Checkpoint', checkpointSchema);