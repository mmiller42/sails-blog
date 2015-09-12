'use strict';

module.exports = uniqueSlugGeneratorFactory('topic', 'name', {
	attributes: {
		name: {
			type: 'string',
			required: true,
			unique: true
		},
		posts: {
			collection: 'post',
			via: 'topics'
		}
	}
});