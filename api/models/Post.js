'use strict';

module.exports = uniqueSlugGeneratorFactory('post', 'title', {
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
		topics: {
			collection: 'topic',
			via: 'posts',
			dominant: true
		}
	}
});