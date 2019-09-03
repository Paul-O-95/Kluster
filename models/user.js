const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRound = 10;

let UserSchema = new Schema({
	name: {type: String},
	email: {type: String},
	password: {type: String},
	timestamp: {type: Date, 'default': Date.now}
});

UserSchema.methods.encryptPassword = function(password){
	let salt = bcrypt.genSaltSync(saltRound);
	let hash = bcrypt.hashSync(password, salt);

	return hash;
}

UserSchema.methods.checkPassword = function(guessPassword){
	return bcrypt.compareSync(guessPassword, this.password)
}

module.exports = mongoose.model('user', UserSchema);