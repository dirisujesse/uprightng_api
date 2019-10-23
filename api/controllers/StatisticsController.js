/**
 * StatisticsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let days;
function getDays(date) {
	date = new Date(date);
	let monthDays = [1].includes(date.getMonth()) ? 29 : [8, 3, 5, 10].includes(date.getMonth()) ? 30 : 31;
	dayss = [];
	for (let i = 0; i < Array(monthDays).length; i++) {
		dayss.push(`${date.getMonth() + 1}/${i+1}/${date.getFullYear()}`)
	}
	return dayss;
}

function sumByDay(data) {
	data = data.length ? data.map(it => Object.assign(it, {
		day: new Date(it.createdAt).toDateString()
	})) : [];
	if (!data.length) {
		return {
			days: days,
			count: Array(days.length).fill(0)
		}
	}
	const count = days.map(it => data.filter(item => new Date(item.day).toDateString() === new Date(it).toDateString()).length)
	return {
		days: days,
		count: count
	}
}


module.exports = {
	counts: function(req, res) {
		Promise.all([Post.count(), Pledge.count(), Testimonial.count(), Suggestions.count(), Product.count(), Order.count(), Comments.count(), User.count()])
			.then(data => res.json({
				posts: data[0],
				pledges: data[1],
				testimonials: data[2],
				suggestions: data[3],
				products: data[4],
				orders: data[5],
				comments: data[6],
				users: data[7]
			}))
			.catch(err => res.negotiate(err))
	},
	periodActivity: function(req, res) {
		days = getDays(req.param('start'));
		Promise.all([Post.find().where({
				'createdAt': {
					'>=': req.param('start'),
					'<': req.param('end')
				}
			}), Pledge.find().where({
				'createdAt': {
					'>=': req.param('start'),
					'<': req.param('end')
				}
			}), Testimonial.find().where({
				'createdAt': {
					'>=': req.param('start'),
					'<': req.param('end')
				}
			}), Suggestions.find().where({
				'createdAt': {
					'>=': req.param('start'),
					'<': req.param('end')
				}
			}), Product.find().where({
				'createdAt': {
					'>=': req.param('start'),
					'<': req.param('end')
				}
			}), Order.find().where({
				'createdAt': {
					'>=': req.param('start'),
					'<': req.param('end')
				}
			}), Comments.find().where({
				'createdAt': {
					'>=': req.param('start'),
					'<': req.param('end')
				}
			}), User.find().where({
				'createdAt': {
					'>=': req.param('start'),
					'<': req.param('end')
				}
			})])
			.then(data => {
				data = {
					posts: sumByDay(data[0]),
					pledges: sumByDay(data[1]),
					testimonials: sumByDay(data[2]),
					suggestions: sumByDay(data[3]),
					products: sumByDay(data[4]),
					orders: sumByDay(data[5]),
					comments: sumByDay(data[6]),
					users: sumByDay(data[7])
				};
				res.json(data);
				``
			})
			.catch(err => res.negotiate(err))
	},
}