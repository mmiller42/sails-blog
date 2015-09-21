'use strict';

module.exports = {
	find: function (req, res) {
		Author.find().exec(function (err, authors) {
			if (err) return res.negotiate(err);

			authors.forEach(function (author) { deleteSensitiveInfo(author, req.session.authorId); });
			res.ok(authors);
		});
	},

	findOne: function (req, res) {
		Author.findOne(req.params.id).exec(function (err, author) {
			if (err) return res.negotiate(err);
			if (!author) return res.notFound();

			deleteSensitiveInfo(author, req.session.authorId);
			res.ok(author);
		});
	},

	logIn: function (req, res) {
		if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') return res.badRequest({ message: 'Email and password are required.' });

		Author.findOne({ email: req.body.email.toLowerCase().trim() }).exec(function (err, author) {
			if (err) return res.negotiate(err);
			if (!author) return res.notFound({ message: 'No author exists with the given email address.' });

			Author.checkPassword(author, req.body.password, function (err, passed) {
				if (err) return res.negotiate(err);
				if (!passed) return res.badRequest({ message: 'The password is incorrect.' });

				req.session.authorId = author.id;
				if (config.adminAuthorId === author.id) author.isAdminAuthor = true;
				res.ok(author);
			});
		});
	},

	logOut: function (req, res) {
		req.session.authorId = null;
		res.ok();
	},

	getCurrentAuthor: function (req, res) {
		getCurrentAuthor(req.session, function (err, author) {
			if (err) return res.negotiate(err);
			if (author && config.adminAuthorId === author.id) author.isAdminAuthor = true;
			res.ok(author);
		});
	},

	updateCurrentAuthor: function (req, res) {
		var attributes = _.without(Object.keys(Author.attributes), [ 'id', 'createdAt', 'updatedAt' ]);
		var changes = {};

		_.forOwn(req.body, function (value, attribute) {
			if (attributes.indexOf(attribute) > -1) changes[attribute] = value;
		});

		Author.update(req.session.authorId, changes, function (err, authors) {
			if (err) return res.negotiate(err);
			if (!authors[0]) return res.notFound();

			res.ok(authors[0]);
		});
	}
};