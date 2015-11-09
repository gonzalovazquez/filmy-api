var mongoose = require('mongoose');
var databaseEndPoint = require('../config/config.js');
var environment = process.argv[2] || 'production';

var db = mongoose.connect('mongodb://localhost/filmy');

//create schema for film
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

//create UserSchema for film
var UserSchema = new mongoose.Schema({
		email: String,
		password: String,
		token: String,
		movies: [FilmSchema]
});
//compile schema to model

module.exports = db.model('film', UserSchema, 'movies');
//module.exports = db.model('UserSchema', UserSchema);
