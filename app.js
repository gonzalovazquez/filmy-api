var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var cors = require('cors');
var FilmModel = require("./model/film");
var expressValidator = require('express-validator');
var Log = require('log');
var log = new Log('info');

app.use(cors());

app.use(bodyParser.json({ extended: true }));
app.use(expressValidator());

app.use(express.static('../filmy/public'));

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });

//Read a list of films
app.get('/api/films', function(req, res) {
	return FilmModel.find(function(err, films) {
		if (!err) {
			log.info('GET films');
			return res.send(films);
		} else {
			return res.status(404).send('Not available');
			log.info(err);
		}
	})
});

// Create a Single Film
app.post('/api/films', function(req, res) {
	var film;
	var error = validateRequest(req);

	if (error) {
		return res.status(400).send('Wrong format');
	}

	log.info('POST films');
	
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
			return res.status(404).send('Not available');
			res.info(err);
		}
	});
	return res.send(film);
});

//Delete a film from collection
app.delete('/api/films/:id', function (req, res){
	log.info('DELETE films');
	return FilmModel.findById(req.params.id, function (err, film) {
		if (film) {
			return film.remove(function (err) {
				if (!err) {
					return FilmModel.find(function(err, films) {
						if (!err) { 
							return res.send(films)
						} else {
							return console.log(err);
						}
					})
				} else {
					console.log(err);
				}
			});
		} else {
			return res.status(400).send('Bad Request');
		}
	});
});

var server = app.listen(15715, function() {
	console.log('CORS-enabled web server listening on port %d', server.address().port);
});

function validateRequest(req) {
	var errors;

	req.checkBody('title', 'Invalid title').notEmpty();
	req.checkBody('year', 'Invalid year').notEmpty();
	req.checkBody('rated', 'Invalid rated').notEmpty();
	req.checkBody('released', 'Invalid released').notEmpty();
	req.checkBody('runtime', 'Invalid runtime').notEmpty();

	errors = req.validationErrors();

	return errors;
}

module.exports.getApp = app;