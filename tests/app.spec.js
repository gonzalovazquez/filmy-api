var request = require('supertest'),
		express = require('express');

var film = { title: 'Pulp Fiction', year: '1945', rated: 'R', released: '1999',
						runtime: '90', genre: 'Drama', director: 'Tarantino', writer: 'Vazquez',
						actors: "Brad Pitt", plot: 'wow', language: 'english', country: 'USA',
						awards: 'All', poster: 'some url', metascore: "45", imdbRating: "90",
						imdbVotes: "67", imdbID: "456", response: "true" };

var app = require('../app.js').getApp;

describe('GET /films', function(){
	it('respond with json', function(done){
		request(app)
			.get('api/films')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});

describe('POST /api/films', function() {
	it('respond with a json of updated database with saved movie', function(done){
		request(app)
			.post('/api/films')
			.send(film)
			.expect(200, done);
	});
});

describe('DELETE /api/films', function() {
	it('delete film from database and responsed with updated json', function(done) {
		request(app)
			.delete('api/films/:124')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});