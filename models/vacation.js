var mongoose = require("mongoose");

var VacationSchema = new mongoose.Schema({
    title: String,
    description: String

});

module.exports =  mongoose.model("Vacation",VacationSchema);