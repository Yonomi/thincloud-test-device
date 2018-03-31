'use strict';

const CredentialManager = require('../lib/utils/credential');
const Device = require('./device');

const DeviceConfig = require('../config/device.config');



class Manager {
  constructor(options){
    this._opts = options
    this.credentialManager = new CredentialManager();
    this.device = new Device({}, this._opts.logger);
    this._combinedPhysicalId = `${options.hostName}-${options.workerId}`;
  };

  init(connectionDetails){
    return Promise.resolve()
      .then(credential => {
        let _config =new DeviceConfig(connectionDetails, this._combinedPhysicalId, 'BE479').device;
        this.device.config = _config;
      })
      .then(config => {
        return this.device.init(config)
      })
  }

  terminate(){
    return Promise.resolve(this.device.disconnect())
      // .then(this.credentialManager.delete())
  }
}

module.exports = Manager;
