'use strict';

global.Promise = require('bluebird');
const os = require('os');

const throng = require('throng');
const logger = require('./lib/utils/logger');
const DeviceManager = require('./lib/device.manager');

const WORKERS = process.env.WEB_CONCURRENCY || 1;
const PORT = process.env.PORT || 3000;
const HEROKU_INFO = getHerokuInfo(process.env);
const HOST_NAME = os.hostname();

let WebApp = require('./lib/app');

const clusterConfig = {
  workers: WORKERS,
  lifetime: Infinity,
  grace: 5000,
  master: startMaster,
  start: startWorker
};

throng(clusterConfig);


function startMaster() {
  logger.info({WORKERS, HEROKU_INFO}, 'master spawing workers');
}

function startWorker(workerId) {
  const workerLogger = logger.child({workerId});
  workerLogger.info({workerId}, 'start worker');

  let deviceManager = new DeviceManager({
    workerId: workerId,
    hostName: HOST_NAME,
    logger: workerLogger,
  });


  process.on('SIGINT', () => {});

  process.on('SIGTERM', () => {
    workerLogger.warn({workerId}, 'worker exiting...');
    deviceManager.terminate().then(()=>{
      workerLogger.warn({device: deviceManager.device.deviceId}, 'certificate cleared');
    });
    setTimeout(()=>{
      process.exit(0)
    }, 10000)
  });



    deviceManager.init().then((data)=>{
      workerLogger.warn({data}, 'device init');
      let app = new WebApp(deviceManager).start()
    }, (err)=>{
      workerLogger.error({err}, 'device exception');
    })



}

let assoc = {
  "accessRole": "owner",
  "deviceId": "817d0c19-e1a4-5528-93a3-686835e10845",
  "deviceReferenceName": "test device",
  "userId": "00000000-0000-0000-0000-000000000001"
};

let _assoc = {
  "accessRole": "owner",
  "deviceId": "817d0c19-e1a4-5528-93a3-686835e10845",
  "deviceReferenceName": "test device",
  "userId": "10ccc9d9-3bd9-497b-91ee-be82bee4a83a"
};

  // 10ccc9d9-3bd9-497b-91ee-be82bee4a83a

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
