/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	orderStats: function(re, res) {
        Order.find()
            .sort('name ASC')
            .populate('purchaser')
            .populate('product')
            .exec(function(err, orders) {
                if (err) {
                    return res.negotiate(err);
                }
                if (!orders) {
                    return res.json({
                        orders: [],
                        delivered: 0,
                        products: 0,
                        purchasers: 0,
                    })
                }
                if (orders) {
                    return res.json({
                        orders: orders,
                        delivered: orders.filter(it => it.hasBeenDelivered).length,
                        products: Array.from(new Set(orders.map(it => it.product.id))).length,
                        purchasers: Array.from(new Set(orders.map(it => it.purchaser.id))).length,
                    })
                }
            })
    }
};

