(function () {
	'use strict';

	angular.module('sailsBlog').directive('sbHeader', [
		'$state', 'getSession', '$rootScope',
		function ($state, getSession, $rootScope) {
			return {
				restrict: 'E',
				scope: {},
				templateUrl: '/backstage/scripts/app/directives/sbHeader.html',
				link: function (scope, element, attrs) {
					$rootScope.$on('$stateChangeSuccess', function () {
						getSession().then(
							function () {
								scope.items = [
									{ glyphicon: 'file', label: 'Posts', sref: 'posts()' },
									{ glyphicon: 'user', label: 'Authors', sref: 'authors()' },
									{ glyphicon: 'lock', label: 'Log Out', sref: 'logOut()' }
								];
							},
							function () {
								scope.items = [
									{ glyphicon: 'lock', label: 'Log In', sref: 'logIn()' }
								];
							}
						);
					});
				}
			};
		}
	]);
})();