'use strict';

global.Promise = require('bluebird');

//

const throng = require('throng');
const Device = require('./lib/device');
const logger = require('./lib/utils/logger');

const WORKERS = process.env.WEB_CONCURRENCY || 1;
const PORT = process.env.PORT || 3000;
const HEROKU_INFO = getHerokuInfo(process.env);

const clusterConfig = {
  workers: WORKERS,
  lifetime: Infinity,
  grace: 5000,
  master: startMaster,
  start: startWorker
};

throng(clusterConfig);

//

function startMaster() {
  logger.info({ WORKERS, HEROKU_INFO }, 'master spawing workers');
}

function startWorker(workerId) {
  const workerLogger = logger.child({ workerId });

  workerLogger.info({ workerId }, 'start worker');

  const device = new Device({
    devicetype: 'mock-device',
    physicalId: '100000', // ??? workerId?
    deviceInfo: require('./config/device.config').device, // ???
    connection: {
      host: 'a28itbge4bjvi5.iot.us-west-2.amazonaws.com',
      region: 'us-west-2',
      port: 8883,
      shadow: true
    },
    pollInterval: 1 * 60 * 1000,
    port: PORT,
    logger: workerLogger
  });

  process.on('SIGINT', () => {});
  process.on('SIGTERM', () => {
    workerLogger.warn({ workerId }, 'worker exiting...');
    device.disconnect().then(() => {
      process.exit(0);
    });
  });

  device.run();
}

function getHerokuInfo(data) {
  const heroku = Object.keys(data)
    .filter(k => {
      return k.startsWith('HEROKU_');
    })
    .reduce((d, k) => {
      d[k] = data[k];
      return d;
    }, {});

  return Object.keys(heroku).length === 0 && heroku.constructor === Object
    ? undefined
    : heroku;
}
