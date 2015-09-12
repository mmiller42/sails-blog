'use strict';

var bcrypt = require('bcrypt');

module.exports = uniqueSlugGeneratorFactory('author', 'displayName', {
	attributes: {
		email: {
			type: 'email',
			required: true,
			unique: true,
			lowercase: true
		},
		password: {
			type: 'string',
			required: true
		},
		displayName: {
			type: 'string',
			unique: true,
			required: true
		},
		bio: {
			type: 'text'
		},
		posts: {
			collection: 'post',
			via: 'author'
		}
	},

	beforeValidate: function (attributes, criteria, done) {
		if (attributes.email) attributes.email = attributes.email.toLowerCase().trim();
		done();
	},

	beforeCreate: function (attributes, done) {
		if (attributes.password === undefined) return done();

		hashPassword(attributes.password, function (err, hash) {
			if (err) return done(err);
			attributes.password = hash;
			done();
		});
	},

	beforeUpdate: function (attributes, criteria, done) {
		if (attributes.password === undefined) return done();

		Author.findOne(criteria).exec(function (err, author) {
			if (err) return done(err);
			if (!author) return done({ status: 404 });

			if (attributes.password === author.password) return done();

			hashPassword(attributes.password, function (err, hash) {
				if (err) return done(err);
				attributes.password = hash;
				done();
			});
		});
	},

	checkPassword: function (author, password, done) {
		bcrypt.compare(password, author.password, done);
	}
});

function hashPassword (password, done) {
	bcrypt.hash(password, 10, done);
}