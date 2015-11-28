var request = require('request');
var Promise = require('promise');
var HOSTNAME = 'http://www.omdbapi.com/?';

function findMovie(name) {
	var movieName = encodeURIComponent(name);
	return new Promise(function (fulfill, reject) {
		request
			.get(HOSTNAME + 't=' + movieName)
			.on('data', function(res) {
				fulfill(res)
			})
			.on('error', function(err) {
				console.log(err + '  Was not able to find movie');
				if (err) {
					reject(err);
				}
			})
	});
}

function validateMovie(id) {
	return new Promise(function (fulfill, reject){
		request
			.get(HOSTNAME + 'i=' + id)
			.on('data', function(res) {
				//Resolve promise
				fulfill(res);
			})
			.on('error', function(err) {
				//Reject promise
				console.log(err + '  Was not able to validate movie');
				if (err) {
					reject(err);
				}
			});
  	});
}

module.exports.validateMovie = validateMovie;
module.exports.findMovie = findMovie;
