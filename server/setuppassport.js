let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let userModel = require('../models/user');

module.exports = function(){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		userModel.findById(id, function(err, user){
			done(null, user);
		});
	});

	passport.use('local-login', new LocalStrategy({
		'usernameField':'email',
		'passwordField':'password',
		'passReqToCallback':true
	}, function(req, email, password, done){
		userModel.findOne({'email':email}, function(err, user){
			if(err){
				return done(null, err);
			}

			if(!user){
				req.flash('loginError','Username or Password Incorrect');
				return done(null, false);
			}

			if(!user.checkPassword(req.body.password)){
				req.flash('loginError','Username or Password Incorrect');
				return done(null, false);
			}

			return done(null, user);
		});
	}));
}