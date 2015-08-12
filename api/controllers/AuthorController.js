'use strict';

module.exports = {
	find: function (req, res) {
		Author.find().exec(function (err, authors) {
			if (err) return res.negotiate(err);

			if (!req.session.authorId) authors.forEach(deleteSensitiveInfo);
			res.ok(authors);
		});
	},

	findOne: function (req, res) {
		Author.find(req.params.id).exec(function (err, user) {
			if (err) return res.negotiate(err);
			if (!user) return res.notFound();

			if (!req.session.authorId) deleteSensitiveInfo(author);
			res.ok(author);
		});
	},

	logIn: function (req, res) {
		if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') return res.badRequest('Email and password are required.');

		Author.findOne({ email: req.body.email.toLowerCase().trim() }).exec(function (err, author) {
			if (err) return res.negotiate(err);
			if (!author) return res.notFound('No author exists with the given email address.');

			Author.checkPassword(author, req.body.password, function (err, passed) {
				if (err) return res.negotiate(err);
				if (!passed) return res.badRequest('The password is incorrect.');

				req.session.authorId = author.id;
				res.ok(author);
			});
		});
	},

	logOut: function (req, res) {
		req.session.authorId = null;
		res.ok();
	},

	me: function (req, res) {
		getCurrentAuthor(req.session, function (err, author) {
			if (err) return res.negotiate(err);

			res.ok(author);
		});
	}
};

function deleteSensitiveInfo (author) {
	delete author.email;
	delete author.password;
}