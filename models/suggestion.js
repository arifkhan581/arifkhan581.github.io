var mongoose = require("mongoose");

var SuggestionSchema = new mongoose.Schema({
    title: String,
    comment: String

});

module.exports =  mongoose.model("Suggestion",SuggestionSchema);