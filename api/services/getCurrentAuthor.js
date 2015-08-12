'use strict';

module.exports = function (session, done) {
	if (session.authorId) {
		Author.findOne(session.authorId, function (err, author) {
			if (err) return done(err);
			if (!author) {
				session.authorId = null;
				return done({ status: 404, message: 'The current user does not seem to exist any longer. The session has been reset.' });
			}

			done(null, author);
		});
	} else {
		done(null, null);
	}
};