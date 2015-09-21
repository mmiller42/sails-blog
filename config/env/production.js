/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

var _ = require('lodash');
var _configTranslation = { hostname: 'host', port: 'port', password: 'pass', database: 'db' };
var redisSettings = _.mapKeys(require('redis-url').parse(process.env.REDISTOGO_URL), function (value, key) {
	return _configTranslation[key] || '';
});
delete redisSettings[''];

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

	connections: {
		'sails-blog': {
			adapter: 'sails-mongo',
			url: process.env.MONGOLAB_URI
		}
	},

	sockets: _.merge({}, redisSettings, {
		adapter: 'socket.io-redis',
		host: redisSettings.host.split(':')[0]
	}),

	session: _.merge({}, redisSettings, {
		adapter: 'redis',
		secret: '65a3f66a85520495afa9456a890ef441',
		host: redisSettings.host.split(':')[0]
	})

};