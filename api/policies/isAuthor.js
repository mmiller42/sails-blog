'use strict';

module.exports = function (req, res, next) {
	Post.findOne(req.params.id).exec(function (err, post) {
		if (err) return res.negotiate(err);
		if (!post) return res.notFound();

		if (req.session.authorId !== post.author) return res.forbidden();

		next();
	});
};