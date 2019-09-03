let async = require('async');
let Models = require('../models');

module.exports = function(callback){
	async.parallel([
		function(next){
			Models.Image.countDocuments({}, next);
		},
		function(next){
			Models.Image.aggregate([{$group:{'_id':1, viewsTotal:{'$sum':'$views'}}}], function(err, result){

				let viewsTotal = 0;
				if(result.length > 0){
					viewsTotal = result[0].viewsTotal
				}

				next(null, viewsTotal);
			});
		},
		function(next){
			Models.Image.aggregate([{$group:{'_id':1, likesTotal:{'$sum':'$likes'}}}], function(err, result){

				let likesTotal = 0;
				if(result.length > 0){
					likesTotal = result[0].likesTotal
				}

				next(null, likesTotal);
			});
		},
		function(next){
			Models.Comment.countDocuments({}, next);
		}
	], function(err, results){
		let stats = {
			images: results[0],
			views: results[1],
			likes: results[2],
			comments: results[3]
		}

		callback(null, stats);
	});
}