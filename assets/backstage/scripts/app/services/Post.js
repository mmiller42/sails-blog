(function () {
	'use strict';

	angular.module('sailsBlog').factory('Post', [
		'$resource',
		function ($resource) {
			return $resource('/api/posts/:postId', {}, {
				create: { method: 'POST' },
				update: { method: 'PUT' },
				save: { method: 'PUT' }
			});
		}
	]);
})();