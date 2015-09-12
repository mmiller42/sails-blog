(function () {
	'use strict';

	angular.module('sailsBlog').factory('Topic', [
		'$resource',
		function ($resource) {
			return $resource('/api/topics/:topicId', {}, {
				create: { method: 'POST' },
				update: { method: 'PUT' },
				save: { method: 'PUT' }
			});
		}
	]);
})();