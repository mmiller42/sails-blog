'use strict';

var slugify = require('slug');
slugify.defaults.mode = 'rfc3986';

module.exports = {
	attributes: {
		title: {
			type: 'string',
			required: true
		},
		body: {
			type: 'text',
			required: true
		},
		author: {
			model: 'author',
			required: true
		},
		slug: {
			type: 'string',
			regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			unique: true
		}
	},

	beforeCreate: function (attributes, done) {
		generateUniqueSlug.call({}, attributes, done);
	},

	beforeUpdate: function (attributes, done) {
		// Only way to get the post we are editing is to pull the arguments
		// out ouf the Post.update method and retrieve the object
		var criteria = Post.update.arguments[0];
		Post.findOne(criteria, function (err, post) {
			if (err) return done(err);
			if (!post) return done('Could not find post to update');

			generateUniqueSlug.call(post, attributes, done);
		});
	}
};

function generateUniqueSlug (attributes, done) {
	var id = this.id;
	if (attributes.slug || !attributes.title) return done();

	var slug = this.slug || slugify(attributes.title);
	Post.find({ slug: { startsWith: slug } }).exec(function (err, posts) {
		if (err) return done(err);

		var highestNumber = -1;
		posts.forEach(function (post) {
			if (post.id === id) return;

			var after = post.slug.substr(slug.length);
			if (!after) {
				// hello
				if (highestNumber < 0) highestNumber = 0;
				return;
			}

			if (after.charAt(0) !== '-') {
				// helloworld
				return;
			}

			// hello-???
			after = after.substr(1);

			if (after && !/^[0-9]+$/.test(after)) {
				// hello-world
				return;
			}

			// hello-N
			var number = parseInt(after, 10);
			if (number > highestNumber) highestNumber = number;
		});

		if (highestNumber > -1) slug += '-' + (highestNumber + 1);
		attributes.slug = slug;
		done();
	});
}