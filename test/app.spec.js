var should = require('should');
var assert = require('assert');
var request = require('supertest');
var express = require('express');
var nock = require("nock");
var app = require('../app.js').getApp;

var filmFixture = { title: 'Pulp Fiction', year: '1945', rated: 'R', released: '1999',
	runtime: '90', genre: 'Drama', director: 'Tarantino', writer: 'Vazquez',
	actors: "John Travolta", plot: 'wow', language: 'english', country: 'USA',
	awards: 'All', poster: 'some url', metascore: "45", imdbRating: "90",
	imdbVotes: "67", imdbID: "tt0110912", response: "true" };

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

describe('user', function() {

	describe('POST /signin', function() {

			it('should return 400 if user credentials are missing', function(done) {
				request(app)
					.post('/signin')
					.expect(400, done);
			});

			it('should create a user', function(done) {
					request(app)
						.post('/signin')
						.send({email: 'example11@gmail.com', password: 'secret'})
						.expect(200, done);
			});

			it('should return the user if it already exists', function(done) {
					request(app)
						.post('/signin')
						.send({email: 'example11@gmail.com', password: 'secret'})
						.expect(401, done);
			});

		});

	describe('POST /authenticate', function() {

		it('should return 400 if user credentials are not entered properly', function(done){
				request(app)
					.post('/authenticate')
					.expect(400, done);
		});

		it('should return 200 when user authenticates', function(done){
				request(app)
					.post('/authenticate')
					.send({email: 'example11@gmail.com', password: 'secret'})
					.expect(200, done)
		});

		it('should return 401 when credentials are wrong', function(done){
				request(app)
					.post('/authenticate')
					.send({email: 'example11@gmail.com', password: 'wrongpassword'})
					.expect(401, done)
		});

	});

	describe('GET /me', function() {

		var token;

		before(function(done) {
			request(app)
				.post('/authenticate')
				.send({email: 'example11@gmail.com', password: 'secret'})
				.end(function(err, res) { // .end handles the response
					if (err) {
						return done(err);
					}
					token = res.body.token;
				done();
				});
		});

		it('should return the user if I pass the correct token', function(done) {
				request(app)
					.get('/me')
					.set('authorization', token)
					.expect(200, done);
		});

		it('should return an error if wrong token is sent', function(done) {
			request(app)
				.get('/me')
				.set('authorization', '123424')
				.expect(401, done);
		});

	});
});


describe('film', function() {

	describe('GET /film with title', function() {

		it('should respond with movie object', function(done) {
			createNock(200, filmFixture);
			request(app)
				.get('/api/?title=Pulp Fiction')
				.expect(200, done);
		});

		it('should validate film by id', function(done) {
			createNock(200, "True");
			request(app)
				.get('/api/validate/?id=tt0110912')
				.expect(200, done);
		});

	});

	describe.only('POST /api/films', function() {

		var token;

		before(function(done) {
			request(app)
				.post('/authenticate')
				.send({email: 'example11@gmail.com', password: 'secret'})
				.end(function(err, res) { // .end handles the response
					if (err) {
						return done(err);
					}
					token = res.body.token;
				done();
				});
		});

		it('should not save a movie if it does not have a valid imdbID', function(done){
			createNock(400, "False");
			request(app)
				.post('/api/films')
				.set('authorization', token)
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
				.set('authorization', token)
				.send(filmFixture)
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
				.set('authorization', token)
				.send(filmFixture)
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
				.set('authorization', token)
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
				.send(filmFixture)
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
