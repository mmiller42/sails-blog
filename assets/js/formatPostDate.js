(function () {
	'use strict';

	try {
		var elements = document.querySelectorAll('[data-time]');
		for (var i = 0, l = elements.length; i < l; ++i) {
			var e = elements[i];
			try {
				var date = new Date(parseInt(e.getAttribute('data-time'), 10));
				if (!isNaN(date.getTime())) {
					e.innerHTML = moment(date).format('MMMM Do, YYYY, hh:mma');
				} else {
					date.toISOString();
				}
			} catch (err) {
				log(err);
			}
		}
	} catch (err) {
		log(err);
	}

	function log (err) {
		if (window.console) console.error('Could not format dates because', err);
	}
})();