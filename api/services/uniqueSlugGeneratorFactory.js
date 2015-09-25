'use strict';

var slugify = require('slug');
slugify.defaults.mode = 'pretty';

module.exports = function uniqueSlugGeneratorFactory (model, slugifyAttribute, schema) {
	return _.merge(schema, {
		attributes: {
			slug: {
				type: 'string',
				regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
				unique: true
			}
		},

		beforeCreate: [ function slugifyBeforeCreate (attributes, done) {
			generateUniqueSlug.call({}, attributes, done);
		} ],

		beforeUpdate: [ function slugifyBeforeUpdate (attributes, criteria, done) {
			var Model = sails.models[model];
			Model.findOne(criteria, function (err, record) {
				if (err) return done(err);
				if (!record) return done('Could not find ' + model + ' to update');

				generateUniqueSlug.call(record, attributes, done);
			});
		} ]
	}, function (a, b) {
		if (Array.isArray(b) && a) return b.concat(a);
	});

	function generateUniqueSlug (attributes, done) {
		var Model = sails.models[model];

		var id = this.id;
		if (attributes.slug || !attributes[slugifyAttribute]) return done();

		var slug = this.slug || slugify(attributes[slugifyAttribute], { lower: true });
		Model.find({ slug: { startsWith: slug } }).exec(function (err, records) {
			if (err) return done(err);

			var highestNumber = -1;
			records.forEach(function (record) {
				if (record.id === id) return;

				var after = record.slug.substr(slug.length);
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
};