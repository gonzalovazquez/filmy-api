var mongoose = require('mongoose');

//connect to database
//var db = mongoose.connect('mongodb://localhost/filmy');

//Production
var db = mongoose.connect('mongodb://gvazquez:swordfish@dbh42.mongolab.com:27427/filmy');

//create schema for film
var filmSchema = new mongoose.Schema({
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
	response: Boolean
});


//compile schema to model
module.exports = db.model('film', filmSchema, 'movies');