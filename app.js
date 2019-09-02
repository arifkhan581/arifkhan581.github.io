var express                = require("express"),
    mongoose               = require("mongoose"),
    passport               = require("passport"),
    methodOverride         = require("method-override"),
    bodyParser             = require("body-parser"),
    User                   = require("./models/user"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoosee = require("passport-local-mongoose"),
    Vacation               = require("./models/vacation"),
    Kpi                    = require("./models/kpis"),
    Suggestion             = require("./models/suggestion"),
    Profile                = require("./models/profile")
    
mongoose.connect("mongodb://localhost/hr_app3",{ useNewUrlParser: true });

var app = express();
app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));


app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//================================================
//ROUTES
//================================================
app.get("/", function(req,res){
    res.redirect("/login");

})


app.get("/profile",isLoggedIn,function(req,res){
    Profile.find({},function(err,allProfile){
        if(err){
            console.log(err)
        }
        else{
              res.render("profile/profile", {allProfile:allProfile});
        }
    })
})

app.post("/profile",isLoggedIn, function(req,res){
var title=    req.body.title
var author= req.body.author
var newCamp = {title:title, author:author};

Profile.create(newCamp,function(err, newlyCamp){
    if(err){
        console.log(err);
    }
    else{
        res.redirect("/profile");
    }
});

});

app.get("/profile/new", function(req, res) {
 
            res.render("profile/new");
     
   
})


// Vacation Route ===============

app.get("/profile/:id/vacation",function(req, res) {
  User.findById(req.params.id, function(err,requestVacation){
        if(err){
            console.log(err)
        }
        else{
                res.render("vacations/vacation", {vacation:requestVacation});

        }
    })
})

app.post("/profile/:id/vacation", function(req,res){
    User.findById(req.params.id, function(err, requestVacation) {
        if(err){
            console.log(err);
            res.redirect('profile')
        } else{
            
            Vacation.create(req.body.vacation, function(err, vacation){
                if(err){
                    console.log(err);
                } else {
                     requestVacation.vacations.push(vacation);
                     requestVacation.save();
                     res.redirect('/profile');
                }
                    })
        }
    })
})

// KPI Route ==================

app.get("/profile/:id/kpi",function(req, res) {
  User.findById(req.params.id).populate("kpis").exec(function(err,requestKpi){
        if(err){
            console.log(err)
        }
        else{
                res.render("kpis/kpi", {kpi:requestKpi});

        }
    })
})

app.get("/profile/:id/kpi/new", function(req, res) {
    User.findById(req.params.id, function(err, newKpi){
        if(err){
            console.log(err)
        }
        else{
            res.render("kpis/new", {kpi:newKpi});
        }
    })
   
})

app.post("/profile/:id/kpi",function(req,res){
    User.findById(req.params.id, function(err, newKpi) {
        if(err){
            console.log(err);
            res.redirect('/profile')
        } else{
            Kpi.create(req.body.kpi, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                     newKpi.kpis.push(comment);
                     newKpi.save();
                     res.redirect('/profile/' + newKpi._id +'/kpi');
                }
                    })
        }
    })
})

// Suggestion Route

app.get("/profile/:id/suggestion", function(req, res) {
    User.findById(req.params.id).populate("suggestions").exec(function(err,showSuggestions){
        if(err){
            console.log(err)
        }
        else{
                res.render("suggestions/suggestion", {suggestion:showSuggestions});

        }
    })
} )

app.post("/profile/:id/suggestion",function(req,res){
    User.findById(req.params.id, function(err, showSuggestions) {
        if(err){
            console.log(err);
            res.redirect('/profile')
        } else{
            Suggestion.create(req.body.suggestion, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                     showSuggestions.suggestions.push(comment);
                     showSuggestions.save();
                     res.redirect('/profile');
                }
                    })
        }
    })
});

//Learning Tool Routes

app.get("/profile/learning",function(req, res) {
    res.render("learningtools/learningtool")
})

// Charting Route 
app.get("/profile/chart", function(req, res) {
    res.render("charts/chart")
})

// Software Route
app.get("/profile/software", function(req, res) {
    res.render("softwares/software");
})

// Directory 
app.get("/profile/directory", function(req, res) {
    res.render("directory/directory");
})

//Auth Routes =====================================

app.get("/register",function(req, res) {
   res.render("register");
})

app.post("/register",function(req,res){
    //req.body.username
   // req.body.password

   var newProfile = new User({
       username:req.body.username,
       lastName:req.body.lastName, 
       firstName:req.body.firstName, 
       phoneNumber: req.body.phoneNumber,
       
   });
   
    User.register(newProfile,req.body.password, function(err,user){
       if(err){
           console.log(err)
           return res.render('register')
       } 
       passport.authenticate("local")(req,res,function(){
           res.redirect("/profile");
       });
    });
})


//Login Route
//render login form
app.get("/login", function(req, res) {
    
    res.render("login");
})


//middleware
app.post("/login",passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login"
}), function(req,res){
})

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
console.log("The Server Has Started!");
});