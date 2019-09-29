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
			defaultsTo: 'https://res.cloudinary.com/jesse-dirisu/image/upload/v1569184517/Mask_Group_4_A12_Group_18_pattern.png'
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
		gender: {
			type: 'string',
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
		},
		isMember: {
			type: 'boolean',
			defaultsTo: false
		},
		incPostCount: function () {
			return this.postCount !== undefined ? this.postCount + 1 : 1;
		},
		decPostCount: function () {
			return this.postCount !== 0 ? this.postCount - 1 : 0;
		},
		incPoints: function (points) {
			return this.points + points;
		},
		decPoints: function (points) {
			return this.points - points;
		},
	},
	afterCreate: function (instance, cb) {
		if (instance.isMember) {
			User.findUserandIncPoints({ user: instance.id, points: 5 }, function (err, data) {
				instance.points = data && data.points ? data.points : instance.points;
				return cb();
			})
		} else {
			return cb();
		}
	},
	findUserandDecPostCount: function (opts, cb) {
		var data = opts;
		if (!(typeof data === "string")) {
			return cb(new Error("You did not provide user and points values"));
		}
		User.findOne({ id: data })
			.exec(function (err, user) {
				if (err) {
					return cb(err);
				}
				if (!user) {
					return cb(new Error("No user by this id was found"));
				}
				if (user) {
					User.update({ id: data }, { postCount: user.decPostCount(), points: user.decPoints(2) })
						.exec(function (err, userData) {
							if (err) {
								return cb(err);
							}
							if (!user) {
								return cb(new Error("We could not update the user with this id"));
							}
							return cb(null, userData.hasOwnProperty('length') ? userData[0] : userData);
						});
				}
			})
	},
	findUserandIncPoints: function (opts, cb) {
		var data = opts;
		if (!(typeof data === 'object' && data.hasOwnProperty('user') && data.hasOwnProperty('points'))) {
			return cb(new Error("You did not provide user and points values"));
		}
		User.findOne({ id: data.user })
			.exec(function (err, user) {
				if (err) {
					return cb(err);
				}
				if (!user) {
					return cb(new Error("No user by this id was found"));
				}
				if (user) {
					User.update({ id: data.user }, { points: user.incPoints(data.points), postCount: data.isNewPost ? user.incPostCount() : user.postCount })
						.exec(function (err, userData) {
							if (err) {
								return cb(err);
							}
							if (!user) {
								return cb(new Error("We could not update the user with this id"));
							}
							return cb(null, userData.hasOwnProperty('length') ? userData[0] : userData);
						});
				}
			})
	},
	findUserandDecPoints: function (opts, cb) {
		var data = opts;
		if (!(typeof data === 'object' && data.hasOwnProperty('user') && data.hasOwnProperty('data.points'))) {
			return cb(new Error("You did not provide user and points values"));
		}
		User.findOne({ id: data.user })
			.exec(function (err, user) {
				if (err) {
					return cb(err);
				}
				if (!user) {
					return cb(new Error("No user by this id was found"));
				}
				if (user) {
					User.update({ id: data.user }, { points: user.decPoints(data.points) })
						.exec(function (err, userData) {
							if (err) {
								return cb(err);
							}
							if (!user) {
								return cb(new Error("We could not update the user with this id"));
							}
							return cb(null, userData.hasOwnProperty('length') ? userData[0] : userData);
						});
				}
			})
	},
};

