/**
 * Testimonial.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "TESTIMONIALS",
  attributes: {
    author: {
      model: 'user',
      required: true,
    },
    location: {
      type: 'string',
      required: true,
    },
    content: {
      type: 'string',
      required: true,
    },
    media: {
      type: 'string',
    },
    mediaType: {
      type: 'string',
    }
  },
};

