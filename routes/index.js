var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User 	= require("../models/user");

// User Routes

//show sign up form
router.get("/register", function(req, res){
   res.render("register"); 
});

///// User, passsword sineup
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message )
            return res.redirect('/register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campground");
        });
    });
});
// LogIn

router.get("/login", function(req, res){
	res.render("login"); //// tuka bese {message: req.flash("error")}
})

// Backedn login
router.post("/login",passport.authenticate("local",
{
	successRedirect: "/campground",
	failureRedirect: "/login"	
}),function(req , res){});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Just loged you out!");
	res.redirect("/campground");
});



module.exports = router;