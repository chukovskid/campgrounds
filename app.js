require('dotenv').config();
var express 		= require('express');
var app 			= express();
var mongoose	    = require('mongoose');
var bodyParser	    = require('body-parser');
var flash           = require("connect-flash");
var passport        =	require("passport");
var LocalStrategy   = require("passport-local");
var methodOverride  = require("method-override");
var Campground	    = require('./models/campground');
var Comment         = require("./models/comment");
var User 	        = require("./models/user");
var seedDB          = require('./seeds');
					  
var campgroundRoutes = require("./routes/campground");
var commentsRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index")

// // Mongoose SetUp
// mongoose.connect('mongodb://localhost:27017/yelp_camp_v3', {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true
// });
mongoose.connect("mongodb+srv://dimefirst:@tatkovinata1@dimescluster-vbmfe.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true,
		useUnifiedTopology: true
}).then(() =>{
	console.log("Connected to online DB");
}).catch(err => {
	console.log("ERROR", err.message);
});


// ova e za da ne se pojavuva error findAndUpdate();
mongoose.set('useFindAndModify', false);


// App setup
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

// seedDB();  // go iskomentirav bidejki sami ke gi stavame od sega!

////Password Conf.
app.use(require("express-session")({
	secret: "Secrets are my life",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// User za sekoe da ne go kopirame (currentUser)
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();	
})


app.use(indexRoutes);
app.use(commentsRoutes);
app.use(campgroundRoutes);



// moze i vaka da gi pisuvame no posle vo Comments treba da se dodade var router  = express.Router({mergeParams: true});
// app.use("/", indexRoutes);
// app.use("/campgrounds", campgroundRoutes);
// app.use("/campgrounds/:id/comments", commentRoutes);



//// LISTENER
var port = process.env.PORT || 3000;
app.listen(port, function () { 
	console.log("The oficial site has started !");
});
