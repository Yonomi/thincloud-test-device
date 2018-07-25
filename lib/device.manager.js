'use strict';

const dConf = require('../config/device.config');
const Device = require('./device');
const jsonFile = require('jsonfile');
const path = require('path');

class Manager {

  constructor(options) {
    this._opts = options;
    this.device = null;
    this.deviceInfo = {
      physicalId: `${options.hostName}-${options.workerId}`,
      deviceType: dConf.get('deviceType')
    };
  }

  init(connectionDetails) {
    const updateDeviceConfig = Object.assign(this.deviceInfo);
    dConf.create();
    const deviceConfig = dConf.get();
    this.device = new Device(deviceConfig, this._opts.logger);
    this.device.isCommissioned = deviceConfig._isCommissioned || null;
    this.device.deviceId = deviceConfig._deviceId || null;
    return this.device.init({autoCommission: false, syncRelatedDevices: true});
  }

  commission() {
    return this.device.commission({ retry: false, force: true })
      .then((data) => {
        _updateDeviceConfig({
          _isCommissioned: true,
          _deviceId: data.result.deviceId
        });
        return data;
      })
      .then(() => this.device.relatedDevices.sync());
  }

  terminate() {
    return Promise.resolve(this.device.disconnect());
  }

  config() {
    return dConf.get();
  }

}

let _updateDeviceConfig = (obj) => {
  let _path = path.join(__dirname, '..', 'config/device.config.json');
  let config = jsonFile.readFileSync(_path);
  Object.assign(config, obj);
  jsonFile.writeFileSync(_path, config);
};

module.exports = Manager;
