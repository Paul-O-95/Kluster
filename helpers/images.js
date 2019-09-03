let Models = require('../models');

module.exports = {
	popular: function(callback){
		Models.Image.find({},{},{limit:9, sort:{'views':-1}}, function(err, images){
			if(err)throw err;

			callback(null, images);
		});
	}
}