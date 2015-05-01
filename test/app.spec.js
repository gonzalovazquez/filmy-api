var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var express = require('express');
var nock = require("nock");
var app = require('../app.js').getApp;

var createNock = function(status, response){ 
	nock("http://www.omdbapi.com")
	.filteringPath(function(path){
				return '/';
	})
	.get("/")
	.reply(status, {
		"Response": response
	});
};

nock.enableNetConnect();


describe('filmy api', function() {

	describe('GET /films', function(){

		it('should response with a json object of films', function(done){
			request(app)
				.get('/api/films')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

	});

	describe('POST /api/films', function() {

		it('should not save a movie if it does not have a valid imdbID', function(done){
			createNock(400, "False");
			request(app)
				.post('/api/films')
				.send({ title: 'Pulp Fiction', year: '1945', rated: 'R', released: '1999',
					runtime: '90', genre: 'Drama', director: 'Tarantino', writer: 'Vazquez',
					actors: "Brad Pitt", plot: 'wow', language: 'english', country: 'USA',
					awards: 'All', poster: 'some url', metascore: "45", imdbRating: "90",
					imdbVotes: "67", imdbID: "456", response: "true" })
				.expect(400)
				.end(function(err, res) { // .end handles the response
					if (err) {
						return done(err);
					}
					done();
				});
		});

		it('should save a movie if valid and respond with the updated list', function(done){
			createNock(200, "True");
			request(app)
				.post('/api/films')
				.send({ title: 'Pulp Fiction', year: '1945', rated: 'R', released: '1999',
					runtime: '90', genre: 'Drama', director: 'Tarantino', writer: 'Vazquez',
					actors: "John Travolta", plot: 'wow', language: 'english', country: 'USA',
					awards: 'All', poster: 'some url', metascore: "45", imdbRating: "90",
					imdbVotes: "67", imdbID: "tt0110912", response: "true" })
				.expect(200)
				.end(function(err, res) { // .end handles the response
					if (err) {
						return done(err);
					}
					done();
				});
		});

		it('should not save if movie is a duplicate', function(done){
			createNock(200, "True");
			request(app)
				.post('/api/films')
				.send({ title: 'Pulp Fiction', year: '1945', rated: 'R', released: '1999',
					runtime: '90', genre: 'Drama', director: 'Tarantino', writer: 'Vazquez',
					actors: "Brad Pitt", plot: 'wow', language: 'english', country: 'USA',
					awards: 'All', poster: 'some url', metascore: "45", imdbRating: "90",
					imdbVotes: "67", imdbID: "tt0110912", response: "true" })
				.expect(401)
				.end(function(err, res) { // .end handles the response
					if (err) {
						return done(err);
					}
					done();
				});
		});

		it('should not save a movie if the json object is invalid', function(done){
			request(app)
				.post('/api/films')
				.send("Bad Stuff!!")
				.expect(400)
				.end(function(err, res) { // .end handles the response
					if (err) {
						return done(err);
					}
					done();
				});
		});

	});

	describe('DELETE /api/films', function() {
		var film_id = 'tt0110912';

		before(function(done) {
			createNock(200, "True");

			request(app)
				.post('/api/films')
				.send({ title: 'Pulp Fiction', year: '1945', rated: 'R', released: '1999',
					runtime: '90', genre: 'Drama', director: 'Tarantino', writer: 'Vazquez',
					actors: "John Travolta", plot: 'wow', language: 'english', country: 'USA',
					awards: 'All', poster: 'some url', metascore: "45", imdbRating: "90",
					imdbVotes: "67", imdbID: film_id, response: "true" })
				.end(function(err, res) { // .end handles the response
					if (err) {
						return done(err);
					}
				done();
				});

		});

		it('should be able to delete move by imdbID', function(done) {
			var url = '/api/films/'+ film_id;
			

			request(app)
					.delete(url)
					.expect(200, done);
		});

		it('should return 400 if film is wrong', function(done) {
			createNock(200, "True");
			request(app)
					.delete('/api/films/12345678')
					.expect(400, done);
		});

	});

	afterEach(function(){
		nock.cleanAll();
	});

});