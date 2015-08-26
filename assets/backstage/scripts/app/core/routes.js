(function () {
	'use strict';

	angular.module('sailsBlog').config([
		'$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			var session = [
				'getSession',
				function (getSession) {
					return getSession();
				}
			];

			$stateProvider
				.state('authors', {
					url: '/authors',
					templateUrl: '/backstage/views/authors.html',
					resolve: { session: session }
				})
				.state('author', {
					url: '/authors/:authorId',
					templateUrl: '/backstage/views/author.html',
					resolve: { session: session }
				})
				.state('posts', {
					url: '/posts',
					templateUrl: '/backstage/views/posts.html',
					resolve: { session: session }
				})
				.state('post', {
					url: '/posts/:postId',
					templateUrl: '/backstage/views/post.html',
					resolve: { session: session }
				})
				.state('logIn', {
					url: '/logIn',
					templateUrl: '/backstage/views/logIn.html'
				});

			$urlRouterProvider.otherwise('/posts');
		}
	]);
})();