'use strict';

const bunyan = require('bunyan');

//

module.exports = (() => {
  const config = {
    name: 'device',
    streams: [
      {
        name: 'stdout',
        stream: process.stdout,
        level: process.env.LOG_LEVEL || 'debug'
      }
    ],
    serializers: bunyan.stdSerializers
  };

  return bunyan.createLogger(config);
})();
