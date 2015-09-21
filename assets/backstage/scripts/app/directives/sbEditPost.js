(function () {
	'use strict';

	angular.module('sailsBlog').directive('sbEditPost', [
		'Author', 'Topic', 'getSession', '$state', 'Post', 'parseWLError', '$q',
		function (Author, Topic, getSession, $state, Post, parseWLError, $q) {
			return {
				restrict: 'E',
				scope: {
					postId: '@'
				},
				templateUrl: '/backstage/scripts/app/directives/sbEditPost.html',
				link: function (scope, element, attrs) {
					var _originalPost = {
						title: '',
						slug: '',
						body: '',
						author: '',
						topics: []
					};

					scope.isNew = !scope.postId;
					scope.author = null;
					scope.isOwner = false;
					scope.saving = false;

					function resetUi () {
						scope.post = _.cloneDeep(_originalPost);
						scope.success = null;
						scope.error = null;
					}
					resetUi();

					scope.refreshTopics = function () {
						var postTopics = JSON.parse(JSON.stringify(scope.post.topics));
						scope.topics = Topic.query();
						scope.topics.$promise.then(function () {
							if (postTopics) {
								var topicsById = _.indexBy(scope.topics, 'id');
								scope.post.topics = postTopics.filter(function (topicId) {
									return topicId in topicsById;
								});
							}
						});
					};
					scope.refreshTopics();

					var _getSession = getSession().then(function (currentAuthor) {
						scope.currentAuthor = currentAuthor;
					});

					if (!scope.isNew) {
						scope.post = Post.get({ postId: scope.postId });
						var _getTopics = Post.getTopics({ postId: scope.postId }).$promise;

						$q.all({ post: scope.post.$promise, topics: _getTopics }).then(function (results) {
							var post = results.post;
							scope.topics.$promise.then(function () {
								post.topics = results.topics.map(function (topic) { return topic.id; });
							});

							_originalPost = post.toJSON();
							_getSession.then(function () {
								scope.isOwner = scope.currentAuthor.id === post.author || scope.currentAuthor.isAdminAuthor;
							});

							Author.get({ authorId: post.author }).$promise.then(function (author) {
								scope.author = author;
							});
						});
					} else {
						_getSession.then(function () {
							_originalPost.author = scope.post.author = scope.currentAuthor.id;
							scope.isOwner = true;
							scope.author = scope.currentAuthor;
						});
					}

					scope.submit = function () {
						scope.saving = true;
						if (!scope.post.slug) delete scope.post.slug;
						var promise;
						if (!scope.isNew) {
							promise = Post.update({ postId: scope.postId }, scope.post).$promise;
						} else {
							promise = Post.create(scope.post).$promise;
						}

						promise.then(
							function (post) {
								if (typeof post.author === 'object') post.author = post.author.id;
								_originalPost = post.toJSON();
								scope.saving = false;
								resetUi();
								scope.success = 'The post has been saved successfully!';
								scope.isNew = false;
								scope.postId = post.id;
							},
							function (err) {
								scope.success = null;
								scope.error = parseWLError(err) || { summary: err.data.message || 'An unknown error occurred.' };
								scope.saving = false;
							}
						);
					};

					scope.cancel = function () {
						var pristinePost = _.omit(scope.post, function (val, key) { return _.startsWith(key, '$') || key === 'toJSON'; });
						if ((!scope.isOwner || _.isEqual(pristinePost, _originalPost)) || confirm('Are you sure you want to discard your unsaved changes?')) {
							resetUi();
							$state.go('posts');
						}
					};

					scope.destroy = function () {
						if (confirm('Are you sure you want to delete `' + scope.post.title + '`?')) {
							Post['delete']({ postId: scope.postId }).$promise.then(function () {
								$state.go('posts');
							});
						}
					};

					scope.$watch('post.body', function () {
						scope.previewBody = markdown.toHTML(scope.post.body || '');
					});
				}
			};
		}
	]);
})();