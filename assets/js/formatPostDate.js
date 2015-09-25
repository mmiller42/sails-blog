(function () {
	'use strict';

	try {
		Array.prototype.slice.call(document.querySelectorAll('[data-time]')).forEach(function (e) {
			try {
				var date = new Date(e.getAttribute('data-time'));
				e.innerHTML = moment(date).format('MMMM Do, YYYY, hh:mma');
			} catch (err) {
				log(err);
			}
		});
	} catch (err) {
		log(err);
	}

	function log (err) {
		if (window.console) {
			console.error('Could not format dates because', err);
		}
	}
})();