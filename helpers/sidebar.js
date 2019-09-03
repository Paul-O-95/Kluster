let async = require('async');
let stats = require('./stats');
let images = require('./images');
let comments = require('./comments');

module.exports = function(viewModel, callback){
	async.parallel([
		function(next){
			stats(next);
		},
		function(next){
			images.popular(next);
		},
		function(next){
			comments.newest(next);
		}
	], function(err, results){
		viewModel.sidebar = {
			stats: results[0],
			popular: results[1],
			newest: results[2]
		}

		callback(viewModel);
	});
}