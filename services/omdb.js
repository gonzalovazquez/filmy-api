var request = require('request');
var Promise = require('promise');
var HOSTNAME = 'http://www.omdbapi.com/?i=';


function validateMovie(id) {
	return new Promise(function (fulfill, reject){
		request
			.get(HOSTNAME + id)
			.on('data', function(res) {
				//Resolve promise
				console.log(res + 'DATA FROM SERVICES');
				fulfill(res);
			})
			.on('error', function(err) {
				//Reject promise
				console.log(err + '  ERROR FROM SERVICES');
				if (err) reject(err);
			});
  	});
}

module.exports.validateMovie = validateMovie;