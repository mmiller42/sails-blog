(function () {
	'use strict';

	angular.module('sailsBlog').directive('sbManageTopics', [
		'Topic', 'parseWLError', '$timeout',
		function (Topic, parseWLError, $timeout) {
			return {
				restrict: 'E',
				scope: {
					state: '=',
					onClose: '&'
				},
				templateUrl: '/backstage/scripts/app/directives/sbManageTopics.html',
				link: function (scope, element, attrs) {
					scope.$watch('state.open', function (isOpen) {
						angular.element(document.getElementsByTagName('body')[0]).toggleClass('modal-open', isOpen);
					});

					scope.topics = Topic.query();

					scope.creating = {};
					scope.editing = null;
					scope.edit = function (topic) {
						scope.editing = JSON.parse(JSON.stringify(topic));
					};

					scope.error = null;
					scope.save = function (create) {
						var promise;
						if (create) {
							promise = Topic.create(scope.creating).$promise;
						} else {
							promise = Topic.update({ topicId: scope.editing.id }, scope.editing).$promise;
						}

						promise.then(
							function (topic) {
								scope.creating = {};
								scope.editing = null;
								scope.error = null;

								if (create) {
									scope.topics.push(topic);
								} else {
									scope.topics.some(function (_topic) {
										if (_topic.id === topic.id) {
											_.merge(_topic, topic);
											return true;
										}
									});
								}
							},
							function (err) {
								scope.error = parseWLError(err) || { summary: 'An unknown error occurred.' };
							}
						);
					};
					scope.create = scope.save.bind(null, true);

					scope.destroy = function (topic) {
						if (!confirm('Are you sure you want to delete `' + topic.name + '`?')) return;

						Topic['delete']({ topicId: topic.id }).$promise.then(
							function () {
								scope.topics.some(function (_topic, i) {
									if (_topic.id === topic.id) {
										scope.topics.splice(i, 1);
										return true;
									}
								});
							},
							function () {
								scope.error = parseWLError(err) || { summary: 'An unknown error occurred.' };
							}
						);
					};

					scope.cancelEdit = function () {
						$timeout(function () {
							scope.editing = null;
						}, 1);
					};

					scope.close = function () {
						scope.state.open = false;
						if (scope.onClose) scope.onClose();
					};
				}
			};
		}
	]);
})();