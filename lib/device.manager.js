'use strict';

const CredentialManager = require('../lib/utils/credential');
const Device = require('./device');

const dConf = require('../config/device.config');

class Manager {
  constructor(options) {
    this._opts = options;
    this.credentialManager = new CredentialManager();
    this.device = new Device({}, this._opts.logger);
    this.deviceInfo = {
      physicalId: `${options.hostName}-${options.workerId}`,
      deviceType: 'BE479'
    };
  };

  init(connectionDetails) {
    if (!connectionDetails) {
      connectionDetails = {host: 'a30sls2kwzsz93.iot.us-west-2.amazonaws.com', region: 'us-west-2', port: 8883}
    }

    return Promise.resolve()
      .then(credential => {
        const updateDeviceConfig = Object.assign(connectionDetails, this.deviceInfo);
        const deviceConfig = dConf.update(updateDeviceConfig);
        this.device = new Device(deviceConfig, this._opts.logger);
      })
      .then(config => this.device.init(config));
  }

  commission(connectionDetails) {
    const updateDeviceConfig = Object.assign(connectionDetails, this.deviceInfo);
    const deviceConfig = dConf.update(updateDeviceConfig);
    this.device.config = deviceConfig;
    return this.device.commission({retry: false});
  }

  terminate() {
    return Promise.resolve(this.device.disconnect())
      // .then(this.credentialManager.delete())
  }
}

module.exports = Manager;
