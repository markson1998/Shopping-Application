var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    userId           : {type : String, required:true},
    ProductId        : {type : String, required:true},
    reviewDescription: {type : String, required:true}
});

module.exports = mongoose.model('Review',schema);