'use strict';

module.exports = {
	populate: function (req, res) {
		if (req.options.alias !== 'author' && req.options.alias !== 'topics') return res.notFound();

		Post.findOne(req.params.parentid).populate(req.options.alias).exec(function (err, post) {
			if (err) return res.negotiate(err);
			if (!post) return res.notFound('No record found with the specified id.');

			if (req.options.alias === 'author') {
				if (!post.author) return res.notFound('Specified record (' + req.params.parentid + ') is missing relation `author`');

				deleteSensitiveInfo(post.author, req.session.authorId);
				res.ok(post.author);
			} else if (req.options.alias === 'topics') {
				if (!post.topics) return res.notFound('Specified record (' + req.params.parentid + ') is missing relation `topics`');
				res.ok(post.topics);
			}
		});
	},

	create: function (req, res) {
		var attributes = _.without(Object.keys(Post.attributes), [ 'id', 'createdAt', 'updatedAt' ]);
		var properties = {};

		_.forOwn(req.body, function (value, attribute) {
			if (attributes.indexOf(attribute) > -1) properties[attribute] = value;
		});

		Post.create(_.omit(properties, 'topics'), function (err, post) {
			if (err) return res.negotiate(err);

			if (!properties.topics) return res.ok(post);
			saveTopics(post.id, properties.topics, res);
		});
	},

	update: function (req, res) {
		var attributes = _.without(Object.keys(Post.attributes), [ 'id', 'createdAt', 'updatedAt' ]);
		var changes = {};

		_.forOwn(req.body, function (value, attribute) {
			if (attributes.indexOf(attribute) > -1) changes[attribute] = value;
		});

		Post.update(req.params.id, _.omit(changes, 'topics'), function (err, posts) {
			if (err) return res.negotiate(err);
			if (!posts[0]) return res.notFound();

			if (!changes.topics) return res.ok(post);
			saveTopics(posts[0].id, changes.topics, res);
		});
	}
};

function saveTopics (postId, topics, res) {
	if (!Array.isArray(topics) || !topics.every(function (topic) { return typeof topic === 'string'; })) {
		return res.badRequest({ data: '`topics` must be an array of IDs.' });
	}

	Post.findOne(postId).populate('topics').exec(function (err, post) {
		if (err) return res.negotiate(err);
		if (!post) return res.notFound();

		var existingTopics = post.topics ? post.topics.map(function (topic) { return topic.id; }) : [];

		if (existingTopics.length) {
			_.difference(existingTopics, topics).forEach(function (topic) {
				post.topics.remove(topic);
			});
			_.difference(topics, existingTopics).forEach(function (topic) {
				post.topics.add(topic);
			});
		} else {
			topics.forEach(function (topic) {
				post.topics.add(topic);
			});
		}

		post.save(function (err, post) {
			if (err) return res.negotiate(err);
			if (!post) return res.notFound();

			post = JSON.parse(JSON.stringify(post));

			if (post.topics) {
				post.topics = post.topics.map(function (topic) { return topic.id; });
			}

			res.ok(post);
		});
	});
}