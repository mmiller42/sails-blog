(function () {
	'use strict';

	angular.module('sailsBlog').directive('sbHeader', [
		'$state',
		function ($state) {
			return {
				restrict: 'E',
				scope: {},
				templateUrl: '/backstage/scripts/app/directives/sbHeader.html',
				link: function (scope, element, attrs) {
					scope.items = [
						{ glyphicon: 'file', label: 'Posts', sref: 'posts()' },
						{ glyphicon: 'user', label: 'Authors', sref: 'authors()' }
					];
				}
			};
		}
	]);
})();