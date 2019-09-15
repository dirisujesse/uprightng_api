/**
 * Suggestions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'SUGGESTIONS',
  attributes: {
  	contributor: {
  		type: 'string',
  		required: true,
  		size: 250
  	},
    email: {
      type: 'email',
      required: true,
    },
    subject: {
      type: 'string',
      required: true,
    },
  	suggestion: {
  		type: 'string',
  	}
  }
};

