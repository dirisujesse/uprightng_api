/**
 * CommentsController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addComment: function(req, res) {
		Comments
		.create({
			upvotes: 0,
			downvotes: 0,
			body: req.param('body'),
			author: req.param('author'),
			post: req.param('post'),
			time:  new Date().toUTCString().replace("GMT", "").trim()
		})
		.exec(function (err, comment){
		  if (err) { 
		  	return res.negotiate(err); 
		  }
		  if (!comment) {
		  	return res.badRequest(); 
		  }
		  if (comment) {
		  	Comments
			.findOne({
				id: comment.id,
			})
			.populate('author')
			.exec(function (err, comment){
			  if (err) { 
			  	return res.negotiate(err); 
			  }
			  if (!comment) {
			  	return res.negotiate(); 
			  }
			  if (comment) {
			  	return res.json(comment);
			  }
			});
		  }
		});
	},
	getComments: function(req, res) {
		Comments
		.find({
			post: req.param('post'),
		})
		.populate('author')
		.exec(function (err, comment){
		  if (err) { 
		  	return res.negotiate(err); 
		  }
		  if (!comment) {
		  	return res.negotiate(); 
		  }
		  if (comment) {
		  	return res.json(comment);
		  }
		});
	},
	upVote: function(req, res) {
		Comments
		.findOne({
			id: req.param('id'),
		})
		.exec(function (err, comment){
		  if (err) { 
		  	return res.negotiate(err); 
		  }
		  if (!comment) {
		  	return res.negotiate(); 
		  }
		  if (comment) {
		  	Comments
		  	.update(req.param('id'), {upvotes: comment.upvotes += 1 })
		  	.exec(function(err, updated){
		  	  if (err) {
		  	    return res.negotiate(err);
		  	  }
		  	  if (updated) {
		  	  	return res.json(updated);
		  	  }
		  	});
		  }
		});
	},
	downVote: function(req, res) {
		Comments
		.findOne({
			id: req.param('id'),
		})
		.exec(function (err, comment){
		  if (err) { 
		  	return res.negotiate(); 
		  }
		  if (!comment) {
		  	return res.negotiate(err); 
		  }
		  if (comment) {
		  	Comments
		  	.update(req.param('id'), {downvotes: comment.downvotes += 1 })
		  	.exec(function(err, updated){
		  	  if (err) {
		  	    return res.negotiate(err);
		  	  }
		  	  if (updated) {
		  	  	return res.json(updated);
		  	  }
		  	});
		  }
		});
	}	
};

