(function () {
	'use strict';

	angular.module('sailsBlog').directive('sbPostTable', [
		'getSession', 'Post', 'Author',
		function (getSession, Post, Author) {
			return {
				restrict: 'E',
				scope: {},
				templateUrl: '/backstage/scripts/app/directives/sbPostTable.html',
				link: function (scope, element, attrs) {
					getSession().then(function (session) {
						scope.currentAuthor = session;
					});

					scope.posts = Post.query();
					scope.authors = {};
					Author.query().$promise.then(function (authors) {
						scope.authors = _.indexBy(authors, 'id');
					});
				}
			};
		}
	]);
})();