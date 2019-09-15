/**
 * Product.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'PRODUCTS',
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true,
    },
    points: {
      type: 'integer',
      required: true,
    },
    rating: {
      type: 'float',
      defaultsTo: 5.0
    },
    image: {
      type: 'string',
      required: true,
    },
    delivery: {
      type: 'string',
      defaultsTo: "4 working days"
    },
    orders: {
			collection: 'order',
			via: 'product'
		},
  },
};

