'use strict';

module.exports = {
	populate: function (req, res) {
		if (req.options.alias !== 'author') return res.notFound();

		Post.findOne(req.params.parentid).populate('author').exec(function (err, post) {
			if (err) return res.negotiate(err);
			if (!post) return res.notFound('No record found with the specified id.');

			if (!post.author) return res.notFound('Specified record (' + req.params.parentid + ') is missing relation `author`');

			deleteSensitiveInfo(post.author, req.session.authorId);
			res.ok(post.author);
		});
	}
};