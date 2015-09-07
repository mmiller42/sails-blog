(function () {
	'use strict';

	angular.module('sailsBlog', [ 'ui.router', 'ngResource', 'ngSanitize', 'parseWLError' ])
		.run([
			'$rootScope', '$state', '$stateParams',
			function ($rootScope, $state, $stateParams) {
				$rootScope.$state = $state;
				$rootScope.$stateParams = $stateParams;

				$rootScope.$on('$stateChangeError', function () {
					if (window.console) console.error('$stateChangeError'), console.error.apply(console, arguments);
				});
			}
		]);
})();