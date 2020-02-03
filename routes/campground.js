var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require("../middleware");   // patot bi bil "../middleware/index" no "index.js" e avtomatsko.

// google maps
var NodeGeocoder = require('node-geocoder')
 var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 var geocoder = NodeGeocoder(options);
// gm


// Campgrond Routes //

// HOME
router.get('/', function(req, res) {
	res.render('home');
});
/// INDEX
router.get('/campground', function(req, res) {
	if(req.query.search){
		var regex = new RegExp(escapeRegex(req.query.search), 'gi');		
			// Get all campgrounds from DB with the name: req.query.search
			Campground.find({name: regex}, function(err, allCampgrounds) {
				if (err) {
					console.log(err);
				} else {
					res.render('campgrounds/index', { campground: allCampgrounds, currentUser: req.user });
			}
		});
		
	} else{ 
		// else: (if the searsh item doesn't exsist)
		// Get all campgrounds from DB
		Campground.find({}, function(err, allCampgrounds) {
			if (err) {
				console.log(err);
			} else {
				res.render('campgrounds/index', { campground: allCampgrounds, currentUser: req.user});
			}
		});
	}	
});
//CREATE
router.post('/campground', middleware.isLogedIn, function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			console.log(err);
		  req.flash('error', 'Invalid address');
		  return res.redirect('back');
		}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		var newCampground = {name: name, image: image, description: description, author:author, location: location, lat: lat, lng: lng};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			//redirect back to campgrounds page
			req.flash("success", "The campground was created");
			res.redirect('/campground');
		}
		});
	});
});
//NEW
router.get('/campground/new', middleware.isLogedIn, function(req, res) {
	res.render('campgrounds/new');
});
// SHOW
router.get('/campground/:id', function(req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCamp) {
			if (err) {
				console.log(err);
			} else {
				res.render('campgrounds/show', { campground: foundCamp});
			}
		});
});
// EDIT
router.get('/campground/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){console.log(err)}
			res.render('campgrounds/edit', { campground: foundCamp });		
	})
});

// UPDATE
router.put('/campground/:id', middleware.checkCampgroundOwnership, function(req, res) {
	// gm
	geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;	
	//gm
	Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp) {
		if (err) {
			console.log(err);
			res.redirect("back");
		} else {
			req.flash("success", "The campground was updated");
			res.redirect('/campground/' + req.params.id);
		}
		});
	});
});

// Delete
router.delete('/campground/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			console.log(err);
		} else {
			req.flash("success", "The campground was deleted");
			res.redirect('/campground');
		}
	});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;