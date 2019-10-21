/**
 * SuggestionsController
 *
 * @description :: Server-side logic for managing suggestions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	suggestionStats: function(re, res) {
        Suggestions.find()
            .sort('name ASC')
            .exec(function(err, suggestions) {
                if (err) {
                    return res.negotiate(err);
                }
                if (!suggestions) {
                    return res.json({
                        suggestions: [],
                        contributors: 0,
                    })
                }
                if (suggestions) {
                    return res.json({
                        suggestions: suggestions,
                        contributors: suggestions.length ? Array.from(new Set(suggestions.map(it => it.contributor))).length : 0,
                    })
                }
            })
    }
};

