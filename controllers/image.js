let path = require('path');
let fs = require('fs');
let ImageModel = require('../models/image');
let CommentModel = require('../models/comment');
let md5 = require('md5');
let sidebar = require('../helpers/sidebar');

module.exports = {
	index: function(req, res){
		let viewModel = {
			image:{},
			comment:[]
		}
		
		ImageModel.findOne({filename:{$regex:req.params.image_id}},function(err, image){
			if(err){
				throw err;
			}

			if(image){
				image.views = image.views + 1;
				image.save();

				viewModel.image = image;
				viewModel.user = req.user;

				CommentModel.find({image_id:image._id}, function(err, comment){
					viewModel.comment = comment;

					ImageModel.find({views:0},{},{sort:{timestamp:-1}}, function(err, noviews){
						if(err){throw err;}

						viewModel.noviews = noviews;
						viewModel.new = noviews.length;

						sidebar(viewModel, function(viewModel){
							res.render('image', viewModel);			
						});
					});
				});
			}else{
				res.redirect('/logged')
			}
		});
	},
	create: function(req, res){
		function saveImage(){
			let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
			let imgUrl = '';

			for(i=0; i<6; i++){
				imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			ImageModel.find({'filename':{$regex:imgUrl}},function(err, image){
				if(err){
					throw err;
				}

				if(image.length > 0){
					saveImage();
				}else{
					let tempPath = req.file.path;
					let ext = path.extname(req.file.originalname).toLowerCase();
					let targetPath = path.resolve('./public/upload/' + imgUrl + ext);

					if(ext === '.jpg' || ext === '.png' || ext === '.jpeg' || ext === '.gif'){
						fs.rename(tempPath, targetPath, function(err){
							if(err){ 
								throw err;
							}

							let newImg = new ImageModel({
								title: req.body.title,
								description: req.body.description,
								filename: imgUrl + ext, 
								user_id: req.user._id
							});

							newImg.save(function(err){
								if(err){
									throw err;
								}

								res.redirect('/logged');
							});
							
						});
					}else{
						fs.unlink(tempPath, function(err){
							if(err){
								throw err;
							}

							res.status(500).send({Error:'Invalid Image Format.'});
						});
					}
				}
			})		
		}

		saveImage();
	},
	like: function(req, res){
		ImageModel.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(!err && image){
				image.likes = image.likes + 1;

				image.save(function(err){
					if(err){
						res.json(err);
					}else{
						res.json({likes: image.likes});
					}
				});
			}else{
				res.redirect('/logged');
			}
		});
	},
	remove: function(req, res){
		ImageModel.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(err){
				throw err;
			}

			if(image){
				fs.unlink(path.resolve('./public/upload/' + image.filename), function(err){
					if(err){
						throw err;
					}

					CommentModel.remove({image_id:image._id}, function(err){
						if(err){
							throw err;
						}

						image.remove(function(err){
							if(err){
								res.json(err);
							}else{
								res.json(true);
							}
						});
					});
				});
			}else{
				res.redirect('/logged');
			}
		});
	},
	comment: function(req, res){
		ImageModel.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(!err && image){
				
				let newComment = new CommentModel(req.body);
				newComment.image_id = image._id;
				newComment.gravatar = md5(req.body.email);
				console.log(newComment.gravatar);

				newComment.save(function(err, comment){
					res.redirect('/image/' + image.uniqueId + '#' + comment._id);
				});

			}else{
				res.redirect('/logged');
			}
		});
	},
	chatroom: function(req, res){
		let viewModel = {}
		
		viewModel.user = req.user;
		
		ImageModel.find({views:0},{},{sort:{timestamp:-1}}, function(err, noviews){
					if(err){throw err;}

					viewModel.noviews = noviews;
					viewModel.new = noviews.length;

					sidebar(viewModel, function(viewModel){
						res.render('chatroom', viewModel);			
					});
		});
	}
}