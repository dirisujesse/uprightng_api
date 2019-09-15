/**
 * Comments.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'COMMENTS',
  attributes: {
  	body: {
  		type: 'text',
  		required: true
  	},
  	author: {
  		model: 'user'
  	},
  	post: {
  		model: 'post'
  	},
  	comment: {
  		model: 'comments'
  	},
  	time: {
  		type: 'string',
  	},
  	replies: {
  		collection: 'comments',
  		via: 'replies'
  	},
  	upvotes: {
  		type: 'integer',
  	},
  	downvotes: {
  		type: 'integer',
  	},
  }
};

