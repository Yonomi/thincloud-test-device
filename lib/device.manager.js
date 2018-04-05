'use strict';

const CredentialManager = require('../lib/utils/credential');
const Device = require('./device');

const DeviceConfig = require('../config/device.config');

class Manager {

  constructor(options) {
    this._opts = options;
    this._combinedPhysicalId = `${options.hostName}-${options.workerId}`;
    this.device = null;
  };

  init(connectionDetails) {
    this.device = new Device(new DeviceConfig({}, this._combinedPhysicalId, 'BE479').device, this._opts.logger);
    return this.device.init({autoCommission: false});
  }
  commission() {
    return this.device.commission({retry: false, force: true});
  }

  terminate() {
    return Promise.resolve(this.device.disconnect());
  }

}

module.exports = Manager;
