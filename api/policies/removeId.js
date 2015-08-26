'use strict';

module.exports = function (req, res, next) {
	delete req.body.id;
	next();
};