/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	signUp: function(req, res) {
		User
		.create({
			name: req.param('name'),
			username: req.param('username'),
			postCount: 0
		})
		.exec(function (err, user){
		  if (err) { 
		  	return res.negotiate(err); 
		  }
		  if (!user) {
		  	return res.negotiate('not found'); 
		  }
		  if (user) {
		  	return res.json(user);
		  }
		});
	},
	updateProfile: function(req, res) {
		User
		.update(req.param('id'), {
			name: req.param('name'),
			email: req.param('email'),
			city: req.param('city'),
			state: req.param('state'),
			country: req.param('country')
		})
		.exec(function (err, user){
		  if (err) { 
		  	return res.negotiate(err); 
		  }
		  if (!user) {
		  	return res.negotiate('not found'); 
		  }
		  if (user) {
		  	return res.json(user);
		  }
		});
	},
	getUser: function(req, res) {
		User
		.findOne({
			id: req.param('id'),
		})
		.exec(function (err, user){
		  if (err) { 
		  	return res.negotiate(err); 
		  }
		  if (!user) {
		  	return res.negotiate('not found'); 
		  }
		  if (user) {
		  	return res.json(user);
		  }
		});
	},
	getTopUsers: function(req, res) {
		User
		.find()
		.where({'name': {'!': 'Anonymous User'}, 'postCount': {'>': 0}})
		.sort('postCount DESC')
		.limit(10)
		.exec(function (err, users){
		  if (err) { 
		  	return res.negotiate(err); 
		  }
		  if (!users) {
		  	return res.negotiate('not found'); 
		  }
		  if (users) {
		  	users = users.map(it => {
		  		return {id: it.id, name: it.name, avatar: it.avatar}
		  	})
		  	return res.json(users);
		  }
		});
	},
	getUserStat: function(req, res) {
		console.log(req.param('id'));
		Post
		.find({
			author: req.param('id'),
		})
		.exec(function (err, posts){
		  if (err) { 
		  	return res.negotiate(err); 
		  }
		  if (!posts) {
		  	return res.negotiate('not found'); 
		  }
		  if (posts) {
		  	var upvotes = posts.length > 0 ? posts.map(post => post.upvotes).reduce((prev, next) => prev + next) : 0;
		  	var downvotes = posts.length > 0 ? posts.map(post => post.downvotes).reduce((prev, next) => prev + next) : 0;
		  	var postsLen = posts.length;
		  	Comments.count({author: req.param('id')}).exec(function(error, count) {
		  	  if (error) {
		  	  	return res.negotiate(err);
		  	  }

		  	  if (count) {
		  	  	console.dir({
		  	  		comments: count,
		  	  		upvotes: upvotes,
		  	  		downvotes: downvotes,
		  	  		posts: postsLen
		  	  	})
		  	  	return res.json({
		  	  		comments: count,
		  	  		upvotes: upvotes,
		  	  		downvotes: downvotes,
		  	  		posts: postsLen
		  	  	});
		  	  }

		  	  if (!count) {
		  	  	return res.json({
		  	  		comments: 0,
		  	  		upvotes: upvotes,
		  	  		downvotes: downvotes,
		  	  		posts: postsLen
		  	  	});
		  	  }
		  	});
		  }
		});
	},
	login: function(req, res) {
		User
		.findOne({
			username: req.param('username'),
		})
		.exec(function (err, user){
		  if (err) { 
		  	return res.negotiate(err); 
		  }
		  if (!user) {
		  	return res.negotiate('not found'); 
		  }
		  if (user) {
		  	return res.json(user);
		  }
		});
	}
};

