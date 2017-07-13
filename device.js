'use strict';

const config = require('./config/device.config.js');
//const sdk = require('./src/thincloud-device-sdk');
const sdk = require('@yonomi/thincloud-device-sdk');

let app = require('express')();
let PORT = process.env.PORT || 8082;

module.exports = class Device {

  constructor(...args) {
    console.log('...', args);
    // create IoT cert if not provided
  }

  run() {
    // optionally load express app and listen
    // run device sdk
    const client = new sdk();
    client.setConfiguration(config.device);
    client.init().then(data => {
      const mainRPCLoopId = setInterval(function(){
        client.request.rpc('get', [{data: {"message": "run get method ok"}}])
          .then((data)=>console.log(data), (err)=> console.log(err));
      }, 10000);
    }, (err) => {

    });
    app.get('/', function (req, res) {
      res.send('Hello World!')
    })

    app.listen(PORT, ()=>{
      console.log('Listening on', PORT);
    })
  }

  cleanup() {
    // remove IoT certs, policies, shadows, etc.
  }

};
