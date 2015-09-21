'use strict';

module.exports = function (req, res, next) {
	if (req.params.id !== req.session.authorId && req.session.authorId !== config.adminAuthorId) return res.forbidden();
	next();
};