(function () {
	'use strict';

	angular.module('sailsBlog').directive('sbAuthorTable', [
		'getSession', 'Author',
		function (getSession, Author) {
			return {
				restrict: 'E',
				scope: {},
				templateUrl: '/backstage/scripts/app/directives/sbAuthorTable.html',
				link: function (scope, element, attrs) {
					getSession().then(function (session) {
						scope.currentAuthor = session;
					});

					scope.authors = Author.query();
				}
			};
		}
	]);
})();