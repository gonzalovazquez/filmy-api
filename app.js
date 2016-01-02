var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var User = require("./model/user");
var Film = require("./model/film");
var expressValidator = require('express-validator');
var Log = require('log');
var log = new Log('info');
var omdb = require('./services/omdb.js');
var validateRequest = require('./utils/validateRequest').validateRequest;

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(expressValidator());
app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// allowing origin to all incoming connections
app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
 });

// rendering index page
 app.get('/', function(req, res) {
 	res.render('pages/index');
});

// Authenticate user
app.post('/authenticate', function(req, res) {
		var error = validateRequest.validateAuthenticate(req);

		if (error) {
			return res.status(400).send('Wrong format' + error);
		}

    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.status(200).json({
                    type: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.status(401).json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        }
    });
});

// Sign In
app.post('/signin', function(req, res) {

	var error = validateRequest.validateUser(req);

	if (error) {
		return res.status(400).send('Wrong format' + error);
	}

    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.status(401).json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.status(401).json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
								userModel.username = req.body.username;
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, 'secret');
                    user.save(function(err, user1) {
												if (err) {
													 return res.status(500).json(err);
												}
                        res.status(200).json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                });
            }
        }
    });
});

// Check User
app.get('/me', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err || user === null) {
            res.status(401).json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.status(200).json({
                type: true,
                data: user
            });
        }
    });
});

// Interceptor to ensure user if valid
function ensureAuthorized(req, res, next) {
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader;
        req.token = bearer;
        next();
    } else {
        res.status(403).send('Unable to authenticate');
    }
}

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
 	});
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
				return res.status(401).send(ex);
			}
		});
});

// Create a Single Film
app.post('/api/films', ensureAuthorized, function(req, res) {
	var film,
			error = validateRequest.validateMovie(req),
			filmExist = false,
			filmID = req.body.imdbID;

	if (error) {
		return res.status(400).send('Wrong format' + error);
	}

	User.findOne({token: req.token}, function(err, user) {
		if (!err) {

			film = Film.createFilmModel(req);

			omdb.validateMovie(film.imdbID).then(function(response){
				var parsedResponse = JSON.parse(response);

				try {
					if (parsedResponse.Response === "False") {
						return res.status(400).send('Invalid movie');
					} else {
							User.find({token: req.token, 'movies.imdbID': film.imdbID}, function(err, movieFound) {
									if (!movieFound.length) {
										user.movies.push(film);
										user.save(function (err) {
											if (!err) {
													log.info('Saved film' + film);
													return res.status(200).send(user);
											} else {
													log.error(err);
													return res.status(404).send('Not available');
											}
										});
									} else {
										return res.status(401).send('Movie already exists');
									}
							});
					}
				} catch (error) {
					log.info(error, 'Something wrong');
					return res.status(400).send('Unable to validate movie');
				}
			});
		} else {
			log.info(err);
			return res.status(500).send('Not available');
		}
	});
});

//Delete a film from collection
app.delete('/api/films/:id', ensureAuthorized, function (req, res){
	log.info('DELETE films');
	//TODO: Return 400 if movie does not exist in user's library
	return User.findOneAndUpdate({token: req.token}, {
		$pull: {
			movies: {imdbID: req.params.id}
		}
	}, function(err, data) {
			if (err) {
				return res.status(400).send(err);
			}

			log.info('Fetching new movies list');
			return User.findOne({token: req.token}, function(err, user) {
					if (err || user === null) {
							return res.status(401).json({
									type: false,
									data: "Error occured: " + err
							});
					} else {
							return res.status(200).json({
									type: true,
									data: user
							});
					}
			});
	});
});

var server = app.listen(app.get('port'), function() {
	log.info('CORS-enabled web server listening on port %d', server.address().port);
});

process.on('uncaughtException', function(err) {
    log.error(err);
});

module.exports.getApp = app;
