'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const path = require('path');

//

class WebApp {

  constructor(deviceManager) {
    this.deviceManager = deviceManager;
    this.app = express();
    this.setConfig();
    this.initRoutes();
  }

  start() {
    this.app.listen(this.app.get('port'));
  }

  initRoutes() {
    let _this = this;
    this.app.get('/', function (req, res) {
      res.redirect('/public/main.html');
    });

    this.app.get('/device', function (req, res) {
      res.send(_this.deviceManager.device.toJSON());
    });

    this.app.get('/device/config', function (req, res) {
      res.send(_this.deviceManager.config());
    });

    this.app.put('/device/state', function (req, res) {
      _this.deviceManager.device.state = req.body;
      _this.deviceManager.device
        .update({ custom: req.body })
        .then(() => res.send(_this.deviceManager.device.toJSON()));
    });

    this.app.post('/device/relatedDevices', function (req, res) {
      _this.deviceManager.device.relatedDevice.add(req.body.deviceId, req.body.deviceType, req.body.physicalId)
        .then((data) => res.send(data), err => res.status(500).send(err));
    });

    this.app.delete('/devices/relatedDevices/:deviceId', function (req, res) {
      _this.deviceManager.device.relatedDevice.remove(req.params.deviceId, req.query.deviceType, req.query.physicalId)
        .then((data) => res.send(data), err => res.status(500).send(err));
    })

    this.app.post('/device/requests', (req, res) => {
      let method = req.body.method;
      let data = JSON.parse(req.body.data);
      if (req.body.method) {
        _this.deviceManager.device.request
          .rpc(method, [data])
          .then(data => res.send(data), err => res.send(err));
      }
    });

    this.app.post('/device/commission', function (req, res) {
      _this.deviceManager.commission()
        .then(data => res.send(data), err => res.status(500).send(err));
    });
  }

  setConfig() {
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.set('port', process.env.PORT || 8082);
  }

}

module.exports = WebApp;
