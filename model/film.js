var createFilmModel = function(req) {
	var film;

	film = {
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
	};

	return film;
};

module.exports.createFilmModel = createFilmModel;
