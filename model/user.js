var mongoose = require('mongoose');
var databaseEndPoint = require('../config/config.js');

console.log('Filmy running in: ', process.env.NODE_ENV);
// connect to database
var db = mongoose.connect(databaseEndPoint[process.env.NODE_ENV]);

// create schema for film
var FilmSchema = new mongoose.Schema({
	title: String,
	year: Number,
	rated: String,
	released: Date,
	runtime: Number,
	genre: Array,
	director: String,
	writer: Array,
	actors: Array,
	plot: String,
	language: Array,
	country: String,
	awards: String,
	poster: String,
	metascore: Number,
	imdbRating: Number,
	imdbVotes: Number,
	imdbID: String,
	response: Boolean,
});

// create UserSchema for film
var UserSchema = new mongoose.Schema({
		username: String,
		email: String,
		password: String,
		token: String,
		movies: [FilmSchema]
});

// compile schema to model
module.exports = db.model('film', UserSchema, 'movies');
