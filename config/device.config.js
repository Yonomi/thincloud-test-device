'use strict';

// region imports
const deviceConfig = require('./device.config.json');
const fs = require('fs');
const path = require('path');
let rootCa = fs.readFileSync(path.join(__dirname, "../rootCA.pem"), "utf-8");
// endregion

class Config {
  constructor(credential, physicalId, deviceType, opts){
    if(!opts) opts = {};
    this.clientCert = credential.certificatePem;
    this.privateKey = credential.keyPair.PrivateKey;
    this.region = opts.region || null;
    this.clientId = opts.clientId || null;
    this.physicalId = physicalId;
    this.deviceType = deviceType;
  }

  get device() {
    return {
      keyPath: deviceConfig.certs.keyPath,
      certPath: deviceConfig.certs.certPath,
      caPath: deviceConfig.certs.caPath,
      clientId: deviceConfig.iotConnection.clientId,
      region: deviceConfig.iotConnection.region,
      physicalId: deviceConfig.physicalId,
      deviceType: deviceConfig.deviceType,
      shadow: deviceConfig.iotConnection.shadow,
      host: deviceConfig.iotConnection.host,
      timeoutCommission: deviceConfig.timeoutCommission,
      timeoutRequest: deviceConfig.timeoutRequest
    };
  }

  toJSON(){
    return {
      clientCert: new Buffer(this.clientCert),
      privateKey: new Buffer(this.privateKey),
      caCert: new Buffer(rootCa),
      region: this.region ? this.region : deviceConfig.iotConnection.region,
      host: deviceConfig.iotConnection.host,
      clientId: `${this.deviceType}_${this.physicalId}`,
      physicalId: this.physicalId,
      deviceType: this.deviceType
    }
  }

}

// region exports
module.exports = Config;
// endregion
