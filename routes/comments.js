var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")   // patot bi bil "../middleware/index" nooo bidejki e "index.js" avtomatski go bara nego



//=============
//Comentari
//+++++++++++++

// New Comment
router.get('/campground/:id/comment/new', middleware.isLogedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			
			res.render('comments/new', { campground: campground });
		}
	});
});
// Create the comment
router.post('/campground/:id/comment', middleware. isLogedIn ,function(req, res) {
	Campground.findById(req.params.id, function(err, camp) {
		if (err) {
			console.log('ima problem');
		} else {
			Comment.create(req.body.comment, function(err, newComment) {
				if (err) {
					console.log('ima error vo create comment');
				} else {
					
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					camp.comments.push(newComment);
					camp.save();
					req.flash("success", "A comment has been created");
					res.redirect('/campground/' + camp._id);
				}
			});
		}
	});
});
// Edit a Comment
router.get("/campground/:id/comment/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
Comment.findById(req.params.comment_id, function(err, foundComent){
		res.render("comments/edit",{campground_id: req.params.id, comment: foundComent})
	})	
})
// Update a Comment
router.put("/campground/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){ console.log("ima error ")
			   }else {
				   req.flash("success", "A comment has been updated");
				   		res.redirect("/campground/" + req.params.id);				   
			   }	
	})
})
// Delete a comment
router.delete("/campground/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){ console.log(err)
			   }else {
				   res.redirect("/campground/" + req.params.id);
			   }
	})
	
})


module.exports = router;