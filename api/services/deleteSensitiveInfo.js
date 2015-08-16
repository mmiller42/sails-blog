'use strict';

module.exports = function deleteSensitiveInfo (author, keepEmail) {
	if (!keepEmail) delete author.email;
	delete author.password;

	return author;
};