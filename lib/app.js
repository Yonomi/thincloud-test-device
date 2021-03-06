'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const _ = require('lodash');
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

    this.app.get('/devices/relatedDevices/:deviceId', function (req, res) {
      _this.deviceManager.device.relatedDevices.get(req.params.deviceId)
        .then((data) => res.send(data), err => res.status(500).send(err));
    });

    this.app.post('/device/relatedDevices', function (req, res) {
      _this.deviceManager.device.relatedDevices.add(req.body)
        .then((data) => res.send(data), err => res.status(500).send(err));
    });

    this.app.post('/devices/relatedDevices/:deviceId', function (req, res) {
      _this.deviceManager.device.relatedDevices.update(req.params.deviceId, req.body)
        .then((data) => res.send(data), err => res.status(500).send(err));
    });

    this.app.delete('/devices/relatedDevices/:deviceId', function (req, res) {
      _this.deviceManager.device.relatedDevices.remove({
        deviceId: req.params.deviceId,
        deviceType: req.query.deviceType,
        physicalId: req.query.physicalId
      },
      {purge: true})
        .then((data) => res.send(data), err => res.status(500).send(err));
    });

    this.app.get('/devices/relatedDevices', function (req, res) {
      if (req.query.sync) {
        _this.deviceManager.device.relatedDevices.sync()
          .then((data) => res.send(data), err => res.status(500).send(err));
      } else {
        return res.send(
          _
            .values(_this.deviceManager.device.relatedDevicesMap)
            .map((device) => device.toJSON()));
      }
    });

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
