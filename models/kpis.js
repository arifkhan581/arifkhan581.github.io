var mongoose = require("mongoose");

var KpiSchema = new mongoose.Schema({
    description: String,
    rating: Number

});

module.exports =  mongoose.model("Kpi",KpiSchema);