(function () {
	'use strict';

	angular.module('sailsBlog').factory('Author', [
		'$resource',
		function ($resource) {
			return $resource('/api/authors/:authorId', {}, {
				create: { method: 'POST' },
				update: { method: 'PUT' },
				save: { method: 'PUT' },
				logIn: {
					method: 'POST',
					url: '/api/logIn'
				},
				logOut: {
					method: 'POST',
					url: '/api/logOut'
				},
				getCurrentAuthor: {
					mehod: 'GET',
					url: '/api/me',
					transformResponse: function (data) {
						if (data === 'null') return { $null: true };
						return angular.fromJson(data);
					}
				}
			});
		}
	]);
})();

if ((method()))