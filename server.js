'use strict';

const throng = require('throng');
const Device = require('./device');

const WORKERS = process.env.WEB_CONCURRENCY || 1;
const PORT = process.env.PORT || 3000;

let app = require('express')();
let PORT = process.env.PORT || 8082;

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
  console.log(`master spawing ${WORKERS} workers`);
}

function startWorker(workerId) {
  console.log(`start worker: ${workerId}`);

  const device = new Device({
    id: workerId,
    port: PORT
  });

  app.get('/', function (req, res) {
    res.send('Hello World!')
  })

  app.listen(PORT, ()=>{
    console.log('Listening on', PORT);
  })

  process.on('SIGINT', () => {});
  process.on('SIGTERM', () => {
    console.log(`Worker ${workerId} exiting...`);
    device.cleanup();
    process.exit();
  });

  device.run();
}
