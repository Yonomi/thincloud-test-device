'use strict';

const nconf = require('nconf');

module.exports = exports = (function loadConfig() {
  nconf
    .use('memory')
    .overrides({})
    .env()
    .argv();

  return {
    get: key => {
      return nconf.get(key);
    }
  };
})();
