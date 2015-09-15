'use strict';

var truncate = require('htmlsave').truncate;
var markdown = require('markdown').markdown;

module.exports = {
	posts: function (req, res) {
		var currentPage = parseInt(req.params.page) || 1;

		async.parallel({
			page: function (done) {
				getPageOfPosts(currentPage, done);
			},
			authors: function (done) {
				Author.find().sort('displayName ASC').exec(done);
			},
			topics: function (done) {
				Topic.find().sort('name ASC').exec(done);
			}
		}, function (err, results) {
			if (err) return res.negotiate(err);

			res.view('posts', {
				breadcrumbs: [
					{ href: '/', label: config.blogTitle }
				],
				authors: results.authors,
				posts: results.page.posts,
				topics: results.topics,
				numberOfPages: results.page.numberOfPages,
				currentPage: results.page.currentPage
			});
		});
	},

	post: function (req, res) {
		Post.findOne({ slug: req.params.slug }).populate('author').populate('topics').exec(function (err, post) {
			if (err) return res.negotiate(err);
			if (!post) return res.notFound({ resource: 'post', slug: req.params.slug });

			Post.find({ author: post.author.id, id: { '!': [ post.id ] } }).sort('createdAt DESC').limit(5).exec(function (err, authorPosts) {
				if (err) return res.negotiate(err);

				post.body = markdown.toHTML(post.body);
				post.author.posts = authorPosts;

				res.view('post', {
					breadcrumbs: [
						{ href: '/', label: config.blogTitle },
						{ href: '/', label: 'Posts' },
						{ href: '/posts/' + post.slug, label: post.title }
					],
					post: post
				});
			});
		});
	},

	authors: function (req, res) {
		Author.find().sort('displayName ASC').exec(function (err, authors) {
			if (err) return res.negotiate(err);

			authors.forEach(function (author) {
				author.bio = author.bio ? markdown.toHTML(author.bio) : '';
			});

			res.view('authors', {
				breadcrumbs: [
					{ href: '/', label: config.blogTitle },
					{ href: '/authors', label: 'Authors' }
				],
				authors: authors
			});
		});
	},

	author: function (req, res) {
		var currentPage = parseInt(req.params.page) || 1;

		async.auto({
			author: function (done) {
				Author.findOne({ slug: req.params.slug }).exec(done);
			},
			page: [ 'author', function (done, results) {
				if (!results.author) return done(null, []);
				getPageOfPosts(currentPage, { author: results.author.id }, done);
			} ]
		}, function (err, results) {
			if (err) return res.negotiate(err);
			if (!results.author) return res.notFound({ resource: 'author', slug: req.params.slug });

			results.author.bio = results.author.bio ? markdown.toHTML(results.author.bio) : '';

			res.view('author', {
				breadcrumbs: [
					{ href: '/', label: config.blogTitle },
					{ href: '/authors', label: 'Authors' },
					{ href: '/authors/' + results.author.slug, label: results.author.displayName }
				],
				author: results.author,
				posts: results.page.posts,
				numberOfPages: results.page.numberOfPages,
				currentPage: results.page.currentPage
			});
		});
	},

	topics: function (req, res) {
		Topic.find({}).sort('name ASC').exec(function (err, topics) {
			if (err) return res.negotiate(err);

			res.view('topics', {
				breadcrumbs: [
					{ href: '/', label: config.blogTitle },
					{ href: '/topics', label: 'Topics' }
				],
				topics: topics
			});
		});
	},

	topic: function (req, res) {
		var currentPage = parseInt(req.params.page) || 1;

		async.auto({
			topic: function (done) {
				Topic.findOne({ slug: req.params.slug }).populate('posts').exec(done);
			},
			topics: function (done) {
				Topic.find({}).sort('name ASC').exec(done);
			},
			page: [ 'topic', function (done, results) {
				if (!results.topic) return done(null, []);
				getPageOfPosts(currentPage, { id: results.topic.posts.map(function (post) { return post.id; }) }, done);
			} ]
		}, function (err, results) {
			if (err) return res.negotiate(err);
			if (!results.topic) return res.notFound({ resource: 'topic', slug: req.params.slug });

			res.view('topic', {
				breadcrumbs: [
					{ href: '/', label: config.blogTitle },
					{ href: '/topics', label: 'Topics' },
					{ href: '/topics/' + results.topic.slug, label: results.topic.name }
				],
				topic: results.topic,
				topics: results.topics,
				posts: results.page.posts,
				numberOfPages: results.page.numberOfPages,
				currentPage: results.page.currentPage
			});
		});
	}
};

function getPageOfPosts (page, criteria, done) {
	if (arguments.length === 2) {
		criteria = {};
		done = arguments[1];
	}

	async.parallel({
		postCount: function (done) {
			Post.count(criteria).exec(done);
		},
		posts: function (done) {
			Post.find(criteria).sort('createdAt DESC').limit(5).skip((page - 1) * 5).populate('author').populate('topics').exec(function (err, posts) {
				done(null, posts.map(function (post) {
					post.body = truncate(markdown.toHTML(post.body), 1000, { ellipsis: '…' });
					return post;
				}));
			});
		}
	}, function (err, results) {
		if (err) return done(err);

		done(null, {
			posts: results.posts,
			numberOfPages: Math.ceil(results.postCount / 5),
			currentPage: page
		});
	});
}