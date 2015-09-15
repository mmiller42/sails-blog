(function () {
	angular.module('inputShortcuts', [])
		.directive('inputShortcuts', function () {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					element.on('keydown', function (v) {
						switch (v.keyCode) {
							case 13: if (attrs.onEnter) scope.$eval(attrs.onEnter); break;
							case 27: if (attrs.onEsc) scope.$eval(attrs.onEsc); break;
						}
					});
				}
			};
		});
})();