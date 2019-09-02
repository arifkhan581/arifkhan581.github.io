var mongoose = require("mongoose");
var passportLocalMongoosee = require("passport-local-mongoose");

var UserSchema  = new mongoose.Schema({
    username: String,
    password: String,
    lastName: String,
    firstName: String,
    phoneNumber: Number,
    
    vacations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vacation"
    }],
    
    kpis: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kpi"
    }],
    
    suggestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Suggestion"
    }],
});

UserSchema.plugin(passportLocalMongoosee);
module.exports = mongoose.model("User", UserSchema);