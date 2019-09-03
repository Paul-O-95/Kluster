let routes = require('./routes');
let express = require('express');
let exphbs = require('express-handlebars');
let path = require('path');
let favicon = require('serve-favicon');
let morgan = require('morgan');
let multer = require('multer');
let bodyParser = require('body-parser');
let moment = require('moment');
let flash = require('express-flash');
let setuppassport = require('./setuppassport');
let session = require('express-session');
let passport = require('passport');
let expressValidator = require('express-validator');
let mongoose = require('mongoose');
let mongoStore = require('connect-mongo')(session);

module.exports = function(app){
	app.use(favicon(path.join(__dirname, '../public', 'img', 'favicon.ico')));
	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json());
	app.use(expressValidator());
	app.use(multer({'dest':'./public/upload/temp'}).single('file'));
	app.use(session({
		'secret':'tV_z;*Hj%20+/',
		'saveUninitialized':false,
		'resave':false,
		'store': new mongoStore({mongooseConnection:mongoose.connection})
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	setuppassport();
	app.use('/public/', express.static(path.join(__dirname, '../public')));
	
	routes(app);
	app.engine('handlebars', exphbs.create({
		helpers:{
			timeago:function(timestamp){
				return moment(timestamp).startOf('minute').fromNow();
			}
		}
	}).engine);
	app.set('view engine', 'handlebars');
	return app;
}