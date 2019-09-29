/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "ORDERS",
  attributes: {
    product: {
      model: "product",
      required: true
    },
    purchaser: {
      model: "user",
      required: true
    },
    hasBeenDelivered: {
      type: "boolean",
      defaultsTo: false
    },
    EDD: {
      type: "integer",
      required: true
    },
    deliveredOn: {
      type: "datetime"
    },
    pickupLocation: {
      type: "string",
      defaultsTo: ""
    }
  },
  afterCreate: function(instance, cb) {
    Order.findOne({id: instance.id})
      .populate('product')
      .exec(function(err, order) {
        if (order) {
          User.findUserandDecPoints({user: instance.purchaser, points: order.product.points}, function(err, data) {
            instance.purchaser = data ? data : instance.purchaser;
            return cb();
          })
        } else {
          return cb();
        }
      })
  },
};

