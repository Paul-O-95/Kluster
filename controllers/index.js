let ImageModel = require('../models/image');
let sidebar = require('../helpers/sidebar');
let UserModel = require('../models/user');

module.exports = {
	login: function(req, res){
		let viewModel = {}

		viewModel.userExist = req.flash('userExist');
		viewModel.userSuccess = req.flash('userSuccess');
		viewModel.loginError = req.flash('loginError');
		viewModel.Errors = req.session.errors;
		req.session.errors = null;
		

		ImageModel.find({},{},{limit:5,sort:{views:-1, timestamp:-1}},function(err, images){
			if(err){throw err;}

			viewModel.images = images;

			viewModel.indicators = [];

			let count = 0;

			for(image in images){
				count++;
				viewModel.indicators.push(count);
			}

			res.render('login', viewModel);
		});
	},
	signup:function(req, res){

		req.check('name','Name Must Not be empty').notEmpty();
		req.check('name','Ensure name matches specified pattern e.g Bill Gates').matches(/[a-zA-Z]*\s[a-zA-Z]*/);
		req.check('email','Email Must Not be empty').notEmpty();
		req.check('email','Ensure you enter a valid email').isEmail();
		req.check('password','Password Must Not be empty').notEmpty();
		req.check('password','Password Must Not be less than 8 characters').trim().isLength({min:8});
		req.check('password','Password Mismatched').equals(req.body.confirmpassword);

		let errors = req.validationErrors();

		if(errors){
			req.session.errors = errors;
			res.redirect('/');
		}else{
			UserModel.findOne({email:req.body.email}, function(err, user){
				if(err){throw err;}

				if(user){
					req.flash('userExist','User Already Exist!');
					res.redirect('/');
				}else{
					let newUser = new UserModel();
					newUser.name = req.body.name;
					newUser.email = req.body.email;
					newUser.password = newUser.encryptPassword(req.body.password);

					newUser.save(function(err){
						if(err){throw err;}
						
						req.flash('userSuccess','User Created Successfully!')
						res.redirect('/');
					});
				}
			});
		}
	},
	index: function(req, res){
		let viewModel = {
			images: [{},{}],
			user:{},
			noviews:[],
			new:0
		}

		ImageModel.find({},{},{sort:{timestamp:-1}}, function(err, images){
			if(err){
				throw err;
			}

			viewModel.images = images;
			viewModel.user = req.user;

			ImageModel.find({views:0},{},{sort:{timestamp:-1}}, function(err, noviews){
				if(err){throw err;}

				viewModel.noviews = noviews;
				viewModel.new = noviews.length;

				sidebar(viewModel, function(viewModel){
					res.render('index', viewModel);			
				});
			});
		});	
	},
	logout:function(req, res){
		req.logout();
		res.redirect('/');
	}
}