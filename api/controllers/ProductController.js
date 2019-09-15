/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    createProduct: function (req, res) {
        var data = req.body;
        var Service = S3Service.upload(data.image || '', `${data.name}_${new Date().valueOf()}`);
        Service
            .then(function (url) {
                var product_ = Object.assign(data, {image: url || 'https://res.cloudinary.com/jesse-dirisu/image/upload/v1530355817/Logo.jpg'})
                Product.create(product_)
                    .exec(function (err, product) {
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
            }).catch(function (err) {
                return res.badRequest();
            })
    },
};

