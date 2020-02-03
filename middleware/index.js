var middlewareObj = {};
var Campground = require('../models/campground');
var Comment = require('../models/comment');


// Comment ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
		if (req.isAuthenticated()) {
			Campground.findById(req.params.id, function(err, foundCamp) {
				if (err) {
					req.flash("error", "Couldn't find the campground");
					res.redirect('back');
				} else {
					if (foundCamp.author.id.equals(req.user._id)) {
						next();
					} else {
						req.flash("error", "This is not your campground");
						res.redirect('back');
					}
				}
			});
		} else {
			console.log('you have to be loged it');
			res.redirect('back');
		}
};

// Comment ownership
middlewareObj.checkCommentOwnership = function(req, res, next){
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
					if (err) {
						req.flash("error", "Couldn't find the comment");
						res.redirect("back"); 
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next ();
				} else {
					req.flash("error", "You have to be the owner");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash("error", "You have to be loged in!");
		res.redirect('back');
	}
};

// IsLogedIn ownership
middlewareObj.isLogedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "You have to be loged in!");
		res.redirect('/login');
	}
};




module.exports = middlewareObj;