var mongoose = require('mongoose');
var databaseEndPoint = require('../config/config.js');
var environment = process.argv[2] || 'production';

var db = mongoose.connect(databaseEndPoint[environment]);

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