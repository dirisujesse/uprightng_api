const opencage = require('opencage-api-client');

module.exports = {
	getCoordLoc: function(lat, long) {
		return new Promise(function (res, rej) {
			opencage.geocode({q: `${lat}, ${long}`, language: 'en'}).then(data => {
			  if (data.status.code == 200) {
			    if (data.results.length > 0) {
			      var place = data.results[0];
			      return res(place.formatted);
			    }
			  } else {
			    return res('Someplace, on Earth');
			  }
			}).catch(error => {
			  return res('Someplace, on Earth');
			});
		})
	}
}