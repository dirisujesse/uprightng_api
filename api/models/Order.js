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

};

