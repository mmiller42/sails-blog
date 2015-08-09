'use strict';

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
		}
		// TODO: add slug, categories later on
	}
};