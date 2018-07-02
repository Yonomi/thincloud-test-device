'use strict';

const dConf = require('../config/device.config');
const Device = require('./device');

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
    return this.device.init({ autoCommission: false, syncRelatedDevices: true});
  }

  commission() {
    return this.device.commission({ retry: false, force: true })
      .then(() => this.device.relatedDevices.sync());
  }

  terminate() {
    return Promise.resolve(this.device.disconnect());
  }

  config() {
    return dConf.get();
  }

}

module.exports = Manager;
