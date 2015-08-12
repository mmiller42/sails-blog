'use strict';

module.exports = function (req, res, next) {
	if (req.params.id !== req.session.authorId) return res.forbidden();
	next();
};