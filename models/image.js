const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const path = require('path');

let ImageSchema = new Schema({
	filename: {type: String},
	title: {type: String},
	description: {type: String},
	views: {type: Number, 'default': 0},
	likes: {type: Number, 'default': 0},
	timestamp: {type: Date, 'default': Date.now},
	user_id:{type:ObjectId}
});

ImageSchema.virtual('uniqueId').get(function(){
	return this.filename.replace(path.extname(this.filename), '');
});

module.exports = mongoose.model('image', ImageSchema);