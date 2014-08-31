var databaseURL = 'mongodb://gvazquez:swordfish@dbh42.mongolab.com:27427/filmy/';
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var cors = require('cors');
var FilmModel = require("./model/film");

app.use(cors());

app.use(bodyParser.urlencoded({
	extended: true}));

app.use(express.static('public'));

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });

//Read a list of films
app.get('/api/films', function(req, res) {
	console.log("Hello from GET");
	return FilmModel.find(function(err, films) {
		if (!err) {
			console.log("NO ERROR", films);
			return res.send(films);
		} else {
			return console.log(err);
		}
	})
});

// Create a Single Product
app.post('/api/films', function(req, res) {
	var film;
	console.log("POST:");
	console.log(req.body);
	film = new FilmModel({
		title: req.body.title,
		year: req.body.year,
		rated: req.body.rated,
		released: req.body.released,
		runtime: req.body.runtime,
		genre: req.body.genre,
		director: req.body.director,
		writer: req.body.writer,
		actors: req.body.actors,
		plot: req.body.plot,
		language: req.body.language,
		country: req.body.country,
		awards: req.body.awards,
		poster: req.body.poster,
		metascore: req.body.metascore,
		imdbRating: req.body.imdbRating,
		imdbVotes: req.body.imdbVotes,
		imdbID: req.body.imdbID,
		response: req.body.response
	});
	film.save(function(err) {
		if (!err) {
			return console.log('created');
		} else {
			return console.log(err);
		}
	});
	return res.send(film);
});


var server = app.listen(15715, function() {
    console.log('CORS-enabled web server listening on port %d', server.address().port);
});