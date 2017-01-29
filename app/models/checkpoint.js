var mongoose = require('mongoose');

var checkpointSchema = mongoose.Schema({
    name:String,
    cars:Array,
    packets:Array,
    dimensions: Object
});
module.exports = mongoose.model('Checkpoint', checkpointSchema);