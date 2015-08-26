(function () {
	'use strict';

	angular.module('sailsBlog').directive('sbLogIn', [
		'Author', 'getSession', '$state',
		function (Author, getSession, $state) {
			return {
				restrict: 'E',
				scope: {},
				templateUrl: '/backstage/scripts/app/directives/sbLogIn.html',
				link: function (scope, element, attrs) {
					function resetUi () {
						scope.credentials = {
							email: '',
							password: ''
						};
						scope.error = null;
					}
					resetUi();

					scope.submit = function () {
						Author.logIn(scope.credentials).$promise.then(
							function (author) {
								getSession.clearCache();
								resetUi();
								$state.go('posts');
							},
							function (err) {
								scope.credentials.password = '';
								scope.error = err.data.message;
							}
						);
					};
				}
			};
		}
	]);
})();