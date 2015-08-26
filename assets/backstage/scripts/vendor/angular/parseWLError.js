(function () {
	angular.module('parseWLError', []).factory('parseWLError', [
		function () {
			var MESSAGES = {
				empty: 'Please do not enter a value.',
				required: 'Please enter a value.',
				notEmpty: 'Please enter a value.',
				json: 'Please enter valid JSON.',
				alpha: 'Please enter only alphabetic characters.',
				alphadashed: 'Please enter only alphabetic characters and dashes.',
				numeric: 'Please enter only numeric characters.',
				alphanumeric: 'Please enter only alphanumeric characters.',
				alphanumericdashed: 'Please enter only alphanumeric characters and dashes.',
				email: 'Please enter a valid email address.',
				url: 'Please enter a valid URL.',
				urlish: 'Please enter a valid URL.',
				ip: 'Please enter a valid IP address.',
				ipv4: 'Please enter a valid IPv4 address.',
				ipv6: 'Please enter a valid IPv6 address.',
				creditcard: 'Please enter a valid credit card number.',
				uuid: 'Please enter a valid UUID.',
				uuidv3: 'Please enter a valid UUID v3.',
				uuidv4: 'Please enter a valid UUID v4.',
				string: 'Please enter some text.',
				int: 'Please enter an integer.',
				integer: 'Please enter an integer.',
				decimal: 'Please enter a decimal.',
				float: 'Please enter a decimal.',
				date: 'Please enter a valid date.',
				datetime: 'Please enter a valid date.',
				hexadecimal: 'Please enter a valid hexadecimal.',
				hexColor: 'Please enter a valid hex color.',
				lowercase: 'Please enter only lowercase letters.',
				uppercase: 'Please enter only uppercase letters.',
				after: 'Please enter a date after the constraint.',
				before: 'Please enter a date before the constraint.',
				equals: 'Please enter the expected value.',
				contains: 'Please enter a value that contains the expected content.',
				notContains: 'Please enter a value that does not contain the expected content.',
				len: 'Please enter a value within the length constraints.',
				in: 'Please enter one of the allowed values.',
				notIn: 'Please enter a value that is not one of the banned values.',
				max: 'Please enter a value less than or equal to the maximum constraint.',
				min: 'Please enter a value greater than or equal to the minimum constraint.',
				greaterThan: 'Please enter a value greater than the minimum constraint.',
				lessThan: 'Please enter a value less than the maximum constraint.',
				minLength: 'Please enter a value at least as long as the minimum length.',
				maxLength: 'Please enter a value no longer than the maximum length.',
				regex: 'Please enter a value that matches the pattern.',
				notRegex: 'Please enter a value that does not match the pattern.',
				unique: 'The value you entered is already in use.',
				DEFAULT: 'Please enter a value according to the constraints.'
			};

			return function parseWLError (err) {
				// Skip errors that don't resemble Waterline validation errors
				if (!err.data || err.data.error !== 'E_VALIDATION' || typeof err.data.invalidAttributes !== 'object')
					return null;

				var summary = '<p>' + err.data.summary + '</p>' + '<ul>';
				var byAttribute = {};

				for (var attribute in err.data.invalidAttributes) {
					if (err.data.invalidAttributes.hasOwnProperty(attribute)) {
						var errObjs = err.data.invalidAttributes[attribute];

						var attributeErrors = [];
						byAttribute[attribute] = [];
						for (var j = 0, m = errObjs.length; j < m; ++j) {
							attributeErrors.push(MESSAGES[errObjs[j].rule] || MESSAGES.DEFAULT);
							byAttribute[attribute].push(MESSAGES[errObjs[j].rule] || MESSAGES.DEFAULT);
						}
						byAttribute[attribute] = byAttribute[attribute].length === 1
							? '<p>' + byAttribute[attribute][0] + '</p>'
							: '<ul><li>' + byAttribute[attribute].join('</li><li>') + '</li></ul>';

						summary += '<li>' + attribute + '<ul><li>' + attributeErrors.join('</li><li>') + '</li></ul></li>';
					}
				}

				summary += '</ul>';

				return {
					status: 400,
					summary: summary,
					byAttribute: byAttribute
				};
			};
		}
	]);
})();