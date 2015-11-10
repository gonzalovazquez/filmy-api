var Log = require('log');
var log = new Log('info');

var validateRequest = {
	validateMovie: function(req) {
		var errors;

		req.checkBody('title', 'Invalid title').notEmpty();
		req.checkBody('year', 'Invalid year').notEmpty();
		req.checkBody('rated', 'Invalid rated').notEmpty();
		req.checkBody('released', 'Invalid released').notEmpty();
		req.checkBody('runtime', 'Invalid runtime').notEmpty();

		errors = req.validationErrors();

		log.info(JSON.stringify(errors));

		return errors;
	},
	validateUser: function(req) {
		var errors;

		req.checkBody('email', 'Invalid email').notEmpty();
		req.checkBody('password', 'Invalid password').notEmpty();

		errors = req.validationErrors();
		log.info(JSON.stringify(errors));

		return errors;
	}
};
// Validate movie request
// function validateRequest(req) {
// 	var errors;
//
// 	req.checkBody('title', 'Invalid title').notEmpty();
// 	req.checkBody('year', 'Invalid year').notEmpty();
// 	req.checkBody('rated', 'Invalid rated').notEmpty();
// 	req.checkBody('released', 'Invalid released').notEmpty();
// 	req.checkBody('runtime', 'Invalid runtime').notEmpty();
//
// 	errors = req.validationErrors();
//
// 	log.info(JSON.stringify(errors));
//
// 	return errors;
// }

// Validate user request
// funcion validateUser(req) {
// 	var errors;
//
// 	req.checkBody('title', 'Invalid title').notEmpty();
// 	req.checkBody('year', 'Invalid year').notEmpty();
//
// 	errors = req.validationErrors();
// 	log.info(JSON.stringify(errors));
//
// 	return errors;
// }

module.exports.validateRequest = validateRequest;
//module.exports.validateUser = validateUser;
