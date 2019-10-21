/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    createProduct: function(req, res) {
        var data = req.body;
        var Service = S3Service.upload(data.image || '', `${data.name}_${new Date().valueOf()}`);
        Service
            .then(function(url) {
                var product_ = Object.assign(data, {
                    image: url || 'https://res.cloudinary.com/jesse-dirisu/image/upload/v1530355817/Logo.jpg'
                })
                Product.create(product_)
                    .exec(function(err, product) {
                        if (err) {
                            return res.negotiate(err);
                        }
                        if (!product) {
                            return res.badRequest();
                        }
                        if (product) {
                            res.json(product)
                        }
                    });
            }).catch(function(err) {
                return res.badRequest();
            })
    },
    updateProduct: function(req, res) {
        var data = req.body;
        if (data.image.startsWith('https://')) {
            Product.update(req.param('id'), data)
                .exec(function(err, product) {
                    if (err) {
                        return res.negotiate(err);
                    }
                    if (!product) {
                        return res.badRequest();
                    }
                    if (product) {
                        res.json(product)
                    }
                });
        } else {
            var Service = S3Service.upload(data.image || '', `${data.name}_${new Date().valueOf()}`);
            Service
                .then(function(url) {
                    var product_ = Object.assign(data, {
                        image: url || 'https://res.cloudinary.com/jesse-dirisu/image/upload/v1530355817/Logo.jpg'
                    })
                    Product.update(req.param('id'), product_)
                        .exec(function(err, product) {
                            if (err) {
                                return res.negotiate(err);
                            }
                            if (!product) {
                                return res.badRequest();
                            }
                            if (product) {
                                res.json(product)
                            }
                        });
                }).catch(function(err) {
                    return res.badRequest();
                })
        }

    },
    productStats: function(re, res) {
        Product.find()
            .sort('name ASC')
            .populate('orders')
            .exec(function(err, products) {
                if (err) {
                    return res.negotiate(err);
                }
                if (!products) {
                    return res.json({
                        products: [],
                        avgOrders: 0,
                        maxOrders: 0,
                        orders: 0,
                    })
                }
                if (products) {
                    const orderArr = products.map(it => it.orders.length || 0);
                    const sumOrders = orderArr.length ? orderArr.reduce((p, n) => p + n) : 0;
                    data = products.map(it => {
                        it.order = it.orders.length || 0;
                        return it;
                    });
                    return res.json({
                        products: data,
                        avgOrders: sumOrders > 0 ? +(sumOrders / products.length).toFixed(2) : 0,
                        maxOrders: Math.max(...orderArr),
                        orders: sumOrders,
                    })
                }
            })
    }
};