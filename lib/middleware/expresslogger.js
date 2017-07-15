'use strict';

const uuid = require('uuid-1345');
const defaultLogger = require('../utils/logger');

/**
 * Express Logger
 * @param {object} options
 */
module.exports = function ({ logger = defaultLogger } = {}) {
  return function (req, res, next) {
    const startTime = process.hrtime();

    req.log = res.log = logger.child({
      reqId: req.reqId || uuid.v4(),
      traceId: req.traceId, // AWS X-RAY specific
      fwdAddress: req.header('x-forwarded-for')
    });

    req.log.info({ req: req }, 'request start');

    res.on('finish', () => {
      res.log.info(
        { req, res, duration: getDuration(startTime) },
        'request finish'
      );
    });

    return next();
  };
};

/**
 * Difference between start and now (hrtime)
 * @param {number} start
 */
function getDuration(start) {
  var hrtime = process.hrtime(start);
  return hrtime[0] * 1e3 + hrtime[1] * 1e-6;
}
