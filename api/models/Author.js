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

	beforeValidation: function (attributes, done) {
		if (attributes.email) attributes.email = attributes.email.toLowerCase().trim();
		done();
	},

	beforeCreate: beforeSave,
	beforeUpdate: beforeSave,

	checkPassword: function (author, password, done) {
		bcrypt.compare(password, author.password, done);
	}
});

function beforeSave (attributes, done) {
	delete attributes.id;

	if (attributes.password) {
		bcrypt.hash(attributes.password, 12, function (err, hash) {
			if (err) return done(err);

			attributes.password = hash;
			done();
		});
	} else {
		done();
	}
}