/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'USERS',
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		username: {
			type: 'string',
			unique: true,
			required: true
		},
		city: {
			type: 'string',
			defaultsTo: 'City'
		},
		state: {
			type: 'string',
			defaultsTo: 'State'
		},
		country: {
			type: 'string',
			defaultsTo: 'Nigeria'
		},
		avatar: {
			type: 'string',
			defaultsTo: 'https://www.gravatar.com/avatar'
		},
		posts: {
			collection: 'post',
			via: 'author'
		},
		orders: {
			collection: 'order',
			via: 'purchaser'
		},
		testimonials: {
			collection: 'testimonial',
			via: 'author'
		},
		postCount: {
			type: 'integer',
			defaultsTo: 0,
			required: false
		},
		comments: {
			collection: 'comments',
			via: 'author'
		},
		email: {
			type: 'string',
			email: true
		},
		telephone: {
			type: 'string',
		},
		points: {
			type: 'integer',
			defaultsTo: 0,
		},
		password: {
			type: 'string',
			unique: true,
			required: true
		}
	}
};

