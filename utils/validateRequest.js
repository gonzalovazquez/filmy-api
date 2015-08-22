var Log = require('log');
var log = new Log('info');

function validateRequest(req) {
	var errors;

	req.checkBody('title', 'Invalid title').notEmpty();
	req.checkBody('year', 'Invalid year').notEmpty();
	req.checkBody('rated', 'Invalid rated').notEmpty();
	req.checkBody('released', 'Invalid released').notEmpty();
	req.checkBody('runtime', 'Invalid runtime').notEmpty();

	errors = req.validationErrors();

	log.info(errors);

	return errors;
}

module.exports.validateRequest = validateRequest;
