var databaseURL = 'mongodb://gvazquez:swordfish@dbh42.mongolab.com:27427/filmy';
var collections = ['movies'];
var db = require('mongojs').connect(databaseURL, collections);
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
	extended: true}));

app.use(express.static('public'));

//Getting Data
app.get('/api/show', function(req, res) {
	db.movies.find((function(err, movie) {
		res.send(movie.map(function(item, i) {
			console.log(item);
		}));
	}));
});

//Storing DATA
app.post('/api/save', function(req, res) {
	db.movies.save(req.body, callback);

	function callback(err, saved) {
		if (err || !saved) {
		  res.send('Couldn\'t proceed');
		} else {
		  console.log(saved, 'callback');
		  res.send(saved);
		}
	}
});

var server = app.listen(15365, function() {
    console.log('Listening on port %d', server.address().port);
});