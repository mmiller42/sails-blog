(function () {
	'use strict';

	angular.module('sailsBlog').service('getSession', [
		'Author', '$q', '$state',
		function (Author, $q, $state) {
			var _cachedPromise;

			function getSession (force) {
				if (!_cachedPromise || force) {
					_cachedPromise = $q(function (resolve, reject) {
						Author.getCurrentAuthor().$promise.then(
							function (currentAuthor) {
								if (!currentAuthor.$null) {
									return resolve(currentAuthor);
								}

								$state.go('logIn');
								reject();
							},
							function (err) {
								if (window.console) console.error(err);
								reject();
							}
						);
					});
				}

				return _cachedPromise;
			}

			getSession.clearCache = function () {
				_cachedPromise = null;
			};

			getSession.endSession = function () {
				return Author.logOut().$promise.then(
					function () {
						getSession.clearCache();
					},
					function (err) {
						if (window.console) console.error(err);
					});
			};

			return getSession;
		}
	]);
})();