'use strict';

module.exports = {
	mostRecent: function (req, res) {
		Post.find().sort({ createdAt: -1 }).limit(1).exec(function (err, posts) {
			if (err) return res.negotiate(err);

			res.ok(posts[0] || null);
		});
	}
};