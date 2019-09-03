let router = require('express').Router();
let index = require('../controllers/index');
let image = require('../controllers/image');
let passport = require('passport');
let isLogged = require('./islogged');

module.exports = function(app){
	router.get('/', index.login);
	router.get('/logged', isLogged, index.index);
	router.get('/image/:image_id', isLogged, image.index);
	router.get('/logout', index.logout);
	router.get('/chatroom', image.chatroom);
	router.post('/image', image.create);
	router.post('/image/:image_id/like', image.like);
	router.post('/image/:image_id/comment', image.comment);
	router.post('/signup', index.signup);
	router.post('/login', passport.authenticate('local-login',{
		'successRedirect':'/logged',
		'failureRedirect':'/',
		'failureFlash':true
	}));
	router.delete('/image/:image_id', image.remove);

	app.use(router);
}