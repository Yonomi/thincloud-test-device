'use strict';

const bunyan = require('bunyan');

//

module.exports = (() => {
  const config = {
    name: process.env.HEROKU_APP_NAME || 'device',
    dyno: process.env.DYNO,
    streams: [
      {
        name: 'stdout',
        stream: process.stdout,
        level: process.env.LOG_LEVEL || 'debug'
      }
    ],
    serializers: bunyan.stdSerializers
  };

  return  bunyan.createLogger(config);
})();
