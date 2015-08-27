var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var FilmModel = require("./model/film");
var expressValidator = require('express-validator');
var Log = require('log');
var log = new Log('info');
var omdb = require('./services/omdb.js');
var validateRequest = require('./utils/validateRequest').validateRequest;

app.use(cors());

app.use(bodyParser.json({ extended: true }));
app.use(expressValidator());

app.use(express.static('public'));

app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
 });

 // Find film
 app.get('/api', function (req, res) {
	var titleName = req.query.title;
 	omdb.findMovie(req.query.title).then(function(response) {
 		var parsedResponse = JSON.parse(response);
 			try {
 				if (!parsedResponse.Response) {
 					return res.send(parsedResponse.Error);
 				} else {
 					return res.send(parsedResponse);
 				}
 			} catch (ex) {
 				return res.send(ex);
 			}
 	})
 });

// Validate Film
app.get('/api/validate', function(req, res) {
	var id = req.query.id;
	omdb.validateMovie(id).then(function(response){
		var parsedResponse = JSON.parse(response);
			try {
				if (!parsedResponse.Response) {
					return res.send(parsedResponse.Error);
				} else {
					return res.send(parsedResponse);
				}
			} catch (ex) {
				return res.send(ex);
			}
		});
});

//Read a list of films
app.get('/api/films', function(req, res) {
	return FilmModel.find(function(err, films) {
		if (!err) {
			log.info('GET films');
			return res.send(films);
		} else {
			log.info(err);
			return res.status(404).send('Not available');
		}
	});
});

// Create a Single Film
app.post('/api/films', function(req, res) {
	var film,
			error = validateRequest(req),
			filmExist = false,
			filmID = req.body.imdbID;

	if (error) {
		return res.status(400).send('Wrong format');
	}

	omdb.validateMovie(filmID).then(function(response){
		var parsedResponse = JSON.parse(response);

		try {
			if (parsedResponse.Response === "False") {
				log.info('Invalid movie');
				log.info(parsedResponse.Error);
				return res.status(400).send('Invalid movie');
			} else {
				film = createFilmModel(FilmModel, req);

				FilmModel.find({ imdbID: filmID }, function(err, obj) {

					filmExist = obj.length;

					if (!filmExist) {
						film.save(function(err) {
							if (!err) {
								log.info('POST films');
								return res.status(200).send(film);
							} else {
								log.info(err);
								return res.status(404).send('Not available');
							}
						});
					} else {
						return res.status(401).send('Film already exists');
					}
				});

			}
		} catch (error) {
			log.info(error, 'Something wrong');
			return res.status(400).send('Unable to validate movie');
		}
	});
});

//Delete a film from collection
app.delete('/api/films/:id', function (req, res){
	log.info('DELETE films');

	return FilmModel.find({imdbID: req.params.id}, function (err, response) {

		if (response.length) {
			return FilmModel.remove(function (err) {
				if (!err) {
					return FilmModel.find(function(err, response) {
						if (!err) {
							return res.send(response)
						} else {
							return console.log(err);
						}
					});
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

function createFilmModel(Model, req) {
	var film;

	film = new Model({
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

	return film;
}

module.exports.getApp = app;
