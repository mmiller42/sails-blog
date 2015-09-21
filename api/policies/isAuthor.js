'use strict';

module.exports = function (req, res, next) {
	if (req.session.authorId === config.adminAuthorId) return next();

	if (req.params.id) {
		Post.findOne(req.params.id).exec(function (err, post) {
			if (err) return res.negotiate(err);
			if (!post) return res.notFound();

			if (req.session.authorId !== post.author) return res.forbidden();

			next();
		});
	} else {
		if (!req.body.author) req.body.author = req.session.authorId;
		if (req.session.authorId !== req.body.author) return res.forbidden();

		next();
	}
};