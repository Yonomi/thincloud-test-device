'use strict';

const CredentialManager = require('../lib/utils/credential');
const Device = require('./device');

const DeviceConfig = require('../config/device.config');

class Manager {

  constructor(options) {
    this._opts = options;
    this.credentialManager = new CredentialManager();
    this.device = new Device({}, this._opts.logger);
    this._combinedPhysicalId = `${options.hostName}-${options.workerId}`;
  };

  init(connectionDetails) {
    if (!connectionDetails) {
      connectionDetails = {host: 'a30sls2kwzsz93.iot.us-west-2.amazonaws.com', region: 'us-west-2', port: 8883};
    }

    return Promise.resolve()
      .then(credential => {
        this.device = new Device(new DeviceConfig(connectionDetails, this._combinedPhysicalId, 'BE479').device, this._opts.logger);
      })
      .then(config => this.device.init(config));
  }

  commission(connectionDetails) {
    let _config = new DeviceConfig(connectionDetails, this._combinedPhysicalId, 'BE479').device;
    this.device.config = _config;
    return this.device.commission({retry: false});
  }

  terminate() {
    return Promise.resolve(this.device.disconnect());
    // .then(this.credentialManager.delete())
  }

}

module.exports = Manager;
