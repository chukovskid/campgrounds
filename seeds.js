var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
	{
		name: 'Prvata slika',
		image:
			'https://wordpress.accuweather.com/wp-content/uploads/2019/03/camping-thumbnail.11.4920AM-1.png?w=632',
		desc: 'description nesto napisano',
		author: "eee"
	},
	{
		name: 'vtora slika',
		image:
			'https://wordpress.accuweather.com/wp-content/uploads/2019/03/camping-thumbnail.11.4920AM-1.png?w=632',
		desc: 'description nesto napisano',
				author: "eee"

		
	},
	{
		name: 'Prvata slika',
		image:
			'https://q9m3bv0lkc15twiiq99aa1cy-wpengine.netdna-ssl.com/wp-content/uploads/2019/07/TENT.jpeg',
		desc: 'eve i tuka nesto',
				author: "eee"

	}
];

function seedDB() {
	Campground.deleteMany({}, function(err) {
		if (err) {
			console.log(err);
		} else {
			// console.log('se od Campground e izbrisano');

			data.forEach(function(seed) {
				Campground.create(seed, function(err, camp) {
					if (err) {
						console.log('ima greska vo seed');
					} else {
						// console.log('kreirano od data bo DB');
						////
						
						 //create a comment
		Comment.create(
		{
		text: "Noviot text prban vo 5.20",
		author: "Homer"
		}, function(err, comment){
		if(err){
		console.log(err);
		} else {
		camp.comments.push(comment);
		camp.save();
		// console.log("Created new comment");
		}
		});

					
					}
					
				});
			});
		}
	});
}
module.exports = seedDB;