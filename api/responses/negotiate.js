/**
 * Generic Error Handler / Classifier
 *
 * Calls the appropriate custom response for a given error,
 * out of the bundled response modules:
 * badRequest, forbidden, notFound, & serverError
 *
 * Defaults to `res.serverError`
 *
 * Usage:
 * ```javascript
 * if (err) return res.negotiate(err);
 * ```
 *
 * @param {*} error(s)
 *
 */

module.exports = function (err) {

  // Get access to response object (`res`)
  var res = this.res;

  var statusCode = 500;
  var body = err;

  try {

    statusCode = err.status || 500;

    // Set the status
    // (should be taken care of by res.* methods, but this sets a default just in case)
    res.status(statusCode);

  } catch (e) {}

  // MongoDB duplicate key error code
  if (err.originalError.name === 'MongoError' && err.originalError.code === 11000) {
    statusCode = 400;

    // Example errmsg: `E11000 duplicate key error index: db_name.model_name.$attribute_name_1 dup key: { : "value" }`
    var model = /: (.*?)\.(.*?)\./.exec(err.originalError.errmsg)[2];
    model = model.charAt(0).toUpperCase() + model.substr(1); // capitalize name
    // Create the error to look like Waterline validation errors (probably should use a WLError constructor, but I
    // haven't figured that out yet)
    body = {
      error: 'E_VALIDATION',
      status: 400,
      summary: '1 attribute is invalid',
      model: model,
      invalidAttributes: {}
    };

    var fieldName = /\.\$(.*?)_\d+\s/.exec(err.originalError.errmsg)[1]; // Extract field name from message
    body.invalidAttributes[fieldName] = { rule: 'unique', message: '`' + err.originalError.getOperation()[fieldName] + '` is not a unique value' };
  }

  // Respond using the appropriate custom response
  if (statusCode === 403) return res.forbidden(body);
  if (statusCode === 404) return res.notFound(body);
  if (statusCode >= 400 && statusCode < 500) return res.badRequest(body);
  return res.serverError(body);
};
