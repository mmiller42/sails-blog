'use strict';

module.exports = {
	mostRecent: function (req, res) {
		Post.find().sort({ createdAt: -1 }).limit(1).exec(function (err, posts) {
			if (err) return res.negotiate(err);

			res.ok(posts[0] || null);
		});
	},

	renderPosts: function (req, res) {
		async.parallel({
			posts: function (done) {
				Post.find().populate('author').exec(done);
			},
			authors: function (done) {
				Author.find().exec(done);
			}
		}, function (err, results) {
			if (err) return res.negotiate(err);
			res.view('posts', results);
		});
	}
};