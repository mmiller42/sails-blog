(function () {
	'use strict';

	angular.module('sailsBlog').directive('sbAuthorTable', [
		function () {
			return {
				restrict: 'E',
				scope: {},
				templateUrl: '/backstage/scripts/app/directives/sbAuthorTable.html',
				link: function (scope, element, attrs) {
					scope.authors = [
						{ id: 1, name: 'Jon Snow' },
						{ id: 2, name: 'Catlyn Stark' }
					];
				}
			};
		}
	]);
})();