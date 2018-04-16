'use strict';

const CredentialManager = require('../lib/utils/credential');
const Device = require('./device');

<<<<<<< HEAD
const dConf = require('../config/device.config');

class Manager {
=======
const DeviceConfig = require('../config/device.config');

class Manager {

>>>>>>> master
  constructor(options) {
    this._opts = options;
    this.device = null;
    this.deviceInfo = {
      physicalId: `${options.hostName}-${options.workerId}`,
      deviceType: 'BE479'
    };
  };

  init(connectionDetails) {
    const updateDeviceConfig = Object.assign(this.deviceInfo);
    const deviceConfig = dConf.update(updateDeviceConfig);
    this.device = new Device(deviceConfig, this._opts.logger);
    return this.device.init({autoCommission: false});
  }
<<<<<<< HEAD

  commission(){
    return this.device.commission({retry: false, force: true})
  }

  terminate(){
=======
  commission() {
    return this.device.commission({retry: false, force: true});
  }

  terminate() {
>>>>>>> master
    return Promise.resolve(this.device.disconnect());
  }

}

module.exports = Manager;
