var mongoose = require("mongoose");

var ProfileSchema = new mongoose.Schema({
     title: String,
    author: String,
    created: {type: Date, default: Date.now}
 

});

module.exports =  mongoose.model("Profile",ProfileSchema)