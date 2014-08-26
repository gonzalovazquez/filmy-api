var databaseURL = 'mongodb://gvazquez:swordfish@dbh42.mongolab.com:27427/filmy';
var collections = ['movies'];
var db = require('mongojs').connect(databaseURL, collections);
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({
	extended: true}));

app.use(express.static('public'));

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });

//Getting Data
app.get('/', function(req, res) {
	db.movies.find((function(err, movie) {		
		res.send(movie.map(function(item, i) {
			console.log(item);
			return item;
		}));
	}));
});

//Storing DATA
app.post('/', function(req, res) {
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

var server = app.listen(15715, function() {
    console.log('CORS-enabled web server listening on port %d', server.address().port);
});