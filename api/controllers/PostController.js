/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
	postevents: function(req, res) {
		if (req.isSocket) {
			Post.subscribe(req, 'postadded');
			return res.ok()
		} else {
			return res.negotiate();
		}
	},
	createPost: function(req, res) {
		var isVideo = req.param('isVideo');
		var Service = isVideo === true ?
			S3Service.uploadVideo(req.param('img') || '', `${req.param('title')}_${new Date().valueOf()}`) :
			isVideo === 'audio' ?
			S3Service.uploadAudio(req.param('img') || '', `${req.param('title')}_${new Date().valueOf()}`) :
			S3Service.upload(req.param('img') || '', `${req.param('title')}_${new Date().valueOf()}`);
		GeolocationService.getCoordLoc(req.param('lat') || 0, req.param('long') || 0).then(function(loc) {
			Service
				.then(function(url) {
					Post.create({
							upvotes: 0,
							downvotes: 0,
							title: req.param('title'),
							body: req.param('body'),
							author: req.param('author'),
							time: new Date().toUTCString().replace("GMT", "").trim(),
							loc: loc,
							lat: req.param('lat') || 0,
							long: req.param('long') || 0,
							image: url || 'https://res.cloudinary.com/jesse-dirisu/image/upload/v1530355817/Logo.jpg',
							anonymous: req.param('anonymous'),
							from_twitter: req.param('from_twitter') || false,
							urls: req.param('urls'),
							featured: req.param('featured') || false,
							hasVideo: isVideo ? true : false,
						})
						.exec(function(err, post) {
							if (err) {
								return res.negotiate(err);
							}
							if (!post) {
								return res.notFound();
							}
							if (post) {
								User.findUserandIncPoints({
									user: req.param('author'),
									points: 2,
									isNewPost: true
								}, function(err, data) {
									if (err) {
										return res.json(post);
									} else {
										post = Object.assign(post, {
											"author": data
										});
										return res.json(post);
									}
								});
							}
						});
				}).catch(function(err) {
					return res.negotiate(err);
				})
		}).catch(err => res.negotiate(err))
	},
	getPost: function(req, res) {
		Post
			.findOne({
				id: req.param('id'),
			})
			.populate('author')
			.exec(function(err, post) {
				if (err) {
					return res.negotiate(err);
				}
				if (!post) {
					return res.negotiate();
				}
				if (post) {
					return res.json(post);
				}
			});
	},
	getPosts: function(req, res) {
		Post
			.find({approved: true})
			.sort("createdAt DESC")
			.limit(50)
			.populate('author')
			.exec(function(err, posts) {
				if (err) {
					return res.negotiate(err);
				}
				if (!posts) {
					return res.negotiate();
				}
				if (posts) {
					return res.json(posts);
				}
			});
	},
	getRecPosts: function(req, res) {
		Post
			.find({approved: true})
			.sort("createdAt DESC")
			.where({
				'createdAt': {
					'>': req.param('time')
				}
			})
			.limit(50)
			.populate('author')
			.exec(function(err, posts) {
				if (err) {
					return res.negotiate(err);
				}
				if (!posts) {
					return res.negotiate();
				}
				if (posts) {
					return res.json(posts);
				}
			});
	},
	getTrendingPosts: function(req, res) {
		Post
			.find({approved: true})
			.where({
				upvotes: {
					'>': 0
				}
			})
			.sort("upvotes DESC")
			.sort("createdAt DESC")
			.limit(10)
			.populate('author')
			.exec(function(err, posts) {
				if (err) {
					return res.negotiate(err);
				}
				if (!posts) {
					return res.negotiate();
				}
				if (posts) {
					return res.json(posts);
				}
			});
	},
	getFeaturedPosts: function(req, res) {
		Post
			.find({"approved": true})
			.where({
				featured: true
			})
			.sort("createdAt DESC")
			.limit(5)
			.populate('author')
			.exec(function(err, posts) {
				if (err) {
					return res.negotiate(err);
				}
				if (!posts) {
					return res.negotiate();
				}
				if (posts) {
					return res.json(posts);
				}
			});
	},
	upVote: function(req, res) {
		Post
			.findOne({
				id: req.param('id'),
			})
			.exec(function(err, post) {
				if (err) {
					return res.negotiate(err);
				}
				if (!post) {
					return res.negotiate();
				}
				if (post) {
					Post
						.update(req.param('id'), {
							upvotes: post.upvotes += 1
						})
						.exec(function(err, updated) {
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
		Post
			.findOne({
				id: req.param('id'),
			})
			.exec(function(err, post) {
				if (err) {
					return res.negotiate(err);
				}
				if (!post) {
					return res.negotiate();
				}
				if (post) {
					Post
						.update(req.param('id'), {
							downvotes: post.downvotes += 1
						})
						.exec(function(err, updated) {
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
	postsAndStats: function(req, res) {
		Post.find()
			.sort("createdAt DESC")
			.exec(function(err, posts) {
				if (err) {
					return res.negotiate(err);
				}
				if (!posts) {
					return res.json({
						posts: [],
						published: 0,
						flagged: 0,
						pending: 0,
						media: {
							video: 0,
							audio: 0,
							image: 0
						},
						source: {
							twitter: 0,
							app: 0
						},
						anonimity: {
							anon: 0,
							notAnon: 0
						}
					})
				}
				if (posts) {
					if (!posts.length) {
						return res.json({
							posts: [],
							published: 0,
							flagged: 0,
							pending: 0,
							media: {
								video: 0,
								audio: 0,
								image: 0
							},
							source: {
								twitter: 0,
								app: 0
							},
							anonimity: {
								anon: 0,
								notAnon: 0
							}
						})
					}
					const [vid, aud, img] = [posts.filter(it => it.image.endsWith('mp4')).length, posts.filter(it => it.image.endsWith('m4a')).length, posts.filter(it => it.image.endsWith('jpg') || it.image.endsWith('png')).length]
					const twitter = posts.filter(it => it.from_twitter).length;
					const anon = posts.filter(it => it.anonymous).length;
					const published = posts.filter(it => it.approved).length;
					const flagged = posts.filter(it => it.flagged).length;
					const pending = posts.filter(it => !it.approved && !it.flagged).length;
					return res.json({
						posts: posts,
						published: published,
						flagged: flagged,
						pending: pending,
						media: {
							video: vid,
							audio: aud,
							image: img
						},
						source: {
							twitter: twitter,
							app: posts.length - twitter
						},
						anonimity: {
							anon: anon,
							notAnon: posts.length - anon
						}
					})
				}
			})
	}
};