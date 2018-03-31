'use strict';

const CredentialManager = require('../lib/utils/credential');
const Device = require('./device');

const DeviceConfig = require('../config/device.config');



class Manager {
  constructor(options){
    this.credentialManager = new CredentialManager();
    this.device = null;
    this._combinedPhysicalId = `${options.hostName}-${options.workerId}`;
    this._opts = options
  };

  init(){
    return Promise.resolve()
      .then(credential => {
        this.device = new Device(new DeviceConfig({}, this._combinedPhysicalId, 'BE479').device, this._opts.logger)
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
