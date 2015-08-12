'use strict';

module.exports = function (req, res, next) {
	getCurrentAuthor(req.session, function (err, author) {
		if (err) return res.negotiate(err);
		if (!author) return res.forbidden();
		next();
	});
};