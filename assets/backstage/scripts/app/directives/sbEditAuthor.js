(function () {
	'use strict';

	angular.module('sailsBlog').directive('sbEditAuthor', [
		'Author', 'getSession', '$state', 'parseWLError',
		function (Author, getSession, $state, parseWLError) {
			return {
				restrict: 'E',
				scope: {
					authorId: '@'
				},
				templateUrl: '/backstage/scripts/app/directives/sbEditAuthor.html',
				link: function (scope, element, attrs) {
					var _originalAuthor = {
						displayName: '',
						email: '',
						password: '',
						bio: ''
					};

					scope.isNew = !scope.authorId;
					scope.isSelf = false;
					scope.saving = false;

					function resetUi () {
						_originalAuthor.password = '';
						scope.author = _.cloneDeep(_originalAuthor);
						scope.success = null;
						scope.error = null;
					}
					resetUi();

					var _getSession = getSession().then(function (currentAuthor) {
						scope.currentAuthor = currentAuthor;
					});

					if (!scope.isNew) {
						scope.author = Author.get({ authorId: scope.authorId });
						scope.author.$promise.then(function (author) {
							_originalAuthor = author.toJSON();
							_getSession.then(function () {
								scope.isSelf = scope.currentAuthor.id === author.id || scope.currentAuthor.isAdminAuthor;
							});
						});
					} else {
						scope.isSelf = true;
					}

					scope.submit = function () {
						scope.saving = true;
						if (!scope.author.password) delete scope.author.password;
						var promise;
						if (!scope.isNew) {
							promise = Author.update({ authorId: scope.authorId }, scope.author).$promise;
						} else {
							promise = Author.create(scope.author).$promise;
						}

						promise.then(
							function (author) {
								_originalAuthor = author.toJSON();
								scope.saving = false;
								resetUi();
								scope.success = 'The author has been saved successfully!';
								if (scope.isNew) {
									scope.isNew = false;
									scope.isSelf = false;
								}
								scope.authorId = author.id;
							},
							function (err) {
								scope.success = null;
								scope.error = parseWLError(err) || { summary: err.data.message || 'An unknown error occurred.' };
								scope.saving = false;
							}
						);
					};

					scope.cancel = function () {
						var pristineAuthor = _.omit(scope.author, function (val, key) { return _.startsWith(key, '$') || key === 'toJSON'; });
						if (_.isEqual(pristineAuthor, _originalAuthor) || confirm('Are you sure you want to discard your unsaved changes?')) {
							resetUi();
							$state.go('authors');
						}
					};

					scope.destroy = function () {
						if (confirm('Are you sure you want to delete `' + scope.author.displayName + '`?')) {
							Post['delete']({ authorId: scope.authorId }).$promise.then(function () {
								$state.go('authors');
							});
						}
					};
				}
			};
		}
	]);
})();