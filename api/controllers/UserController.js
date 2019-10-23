/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	usersAndStats: function(req, res) {
		User.find()
			.sort("name DESC")
			.exec(function(err, users) {
				if (err) {
					return res.negotiate(err);
				}
				if (!users) {
					return res.json({
						users: [],
						members: 0,
						minPosts: 0,
						avgPosts: 0,
						maxPosts: 0,
						points: 0,
						maxPoints: 0,
						minPoints: 0,
						avgPoints: 0,
						male: 0,
						female: 0,
						other: 0,
					})
				}
				if (users) {
					if (!users.length) {
						return res.json({
							users: [],
							members: 0,
							minPosts: 0,
							avgPosts: 0,
							maxPosts: 0,
							points: 0,
							maxPoints: 0,
							minPoints: 0,
							avgPoints: 0,
							male: 0,
							female: 0,
							other: 0,
						})
					}
					const members = users.filter(it => it.isMember).length;
					const postLenArr = users.map(it => it.postCount || 0);
					const pointsArr = users.map(it => it.points || 0);
					const male = users.filter(it => it.gender && it.gender.toLowerCase().startsWith('male')).length;
					const female = users.filter(it => it.gender && it.gender.toLowerCase().startsWith('female')).length;
					return res.json({
						users: users,
						members: members,
						minPosts: Math.min(...postLenArr),
						avgPosts: postLenArr.reduce((p, n) => p + n) / postLenArr.length,
						maxPosts: Math.max(...postLenArr),
						points: pointsArr.reduce((p, n) => p + n),
						maxPoints: Math.max(...pointsArr),
						minPoints: Math.min(...pointsArr),
						avgPoints: pointsArr.reduce((p, n) => p + n) / pointsArr.length,
						male: male,
						female: female,
						other: users.length - (male + female),
					})
				}
			})
	},
	signUp: function(req, res) {
		User.findOne({
			username: req.param('username')
		}).exec(function(err, usr) {
			if (err) {
				return res.negotiate(err);
			}
			if (!usr) {
				User
					.create({
						name: req.param('name'),
						username: req.param('username'),
						password: req.param('password'),
						isMember: req.param('isMember'),
						postCount: 0
					})
					.exec(function(err, user) {
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
			if (usr) {
				return res.badRequest()
			}
		})
	},
	updateProfile: function(req, res) {
		var body = req.body;
		if (body.isImg) {
			var Service = S3Service.upload(body.avatar || '', `${body.name}_${new Date().valueOf()}`);
			Service
				.then(function(url) {
					var user_ = Object.assign(body, {
						avatar: url || 'https://res.cloudinary.com/jesse-dirisu/image/upload/v1569184517/Mask_Group_4_A12_Group_18_pattern.png'
					})
					User
						.update(req.param('id'), user_)
						.exec(function(err, user) {
							if (err) {
								return res.negotiate(err);
							}
							if (!user) {
								return res.negotiate('not found');
							}
							if (user) {
								return res.json(user);
							}
						})
				}).catch(function(err) {
					return res.badRequest();
				})
		} else {
			User
				.update(req.param('id'), body)
				.exec(function(err, user) {
					if (err) {
						return res.negotiate(err);
					}
					if (!user) {
						return res.negotiate('not found');
					}
					if (user) {
						if (body.isMembership) {
							User.findUserandIncPoints({
								user: req.param('id'),
								points: 5,
							}, function(err, data) {
								if (err) {
									return res.json(user);
								} else {
									return res.json(data);
								}
							});
						} else {

						}
					}
				});
		}

	},
	getUser: function(req, res) {
		User
			.findOne({
				id: req.param('id'),
			})
			.exec(function(err, user) {
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
			.where({
				'name': {
					'!': 'Anonymous User'
				},
				'postCount': {
					'>': 0
				}
			})
			.sort('points DESC')
			.sort('postCount DESC')
			.limit(10)
			.exec(function(err, users) {
				if (err) {
					return res.negotiate(err);
				}
				if (!users) {
					return res.negotiate('not found');
				}
				if (users) {
					// users = users.map(it => {
					// 	return { id: it.id, name: it.name, avatar: it.avatar }
					// })
					return res.json(users);
				}
			});
	},
	getUserStat: function(req, res) {
		User.findOne({
				id: req.param('id')
			})
			.populate("comments", {
				limit: 0
			})
			.exec(function(err, user) {
				if (err) {
					return res.negotiate(err);
				}
				if (!user) {
					return res.negotiate('not found');
				}
				if (user) {
					return res.json({
						comments: user.comments ? user.comments.length : 0,
						points: user.points,
						posts: user.postCount,
					});
				}
			});
	},
	login: function(req, res) {
		User
			.findOne({
				username: req.param('username'),
				password: req.param('password'),
			})
			.exec(function(err, user) {
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