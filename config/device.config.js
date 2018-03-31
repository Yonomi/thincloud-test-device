'use strict';

// region imports
const deviceConfig = require('./device.config.json');
const fs = require('fs');
const path = require('path');
let rootCa = fs.readFileSync(path.join(__dirname, "../rootCA.pem"), "utf-8");
// endregion

class Config {
  constructor(connectionDetails, physicalId, deviceType, opts){
    if(!opts) opts = {};
    this.host = connectionDetails.host;
    this.region = connectionDetails.region || null;
    this.port = connectionDetails.port || 8883;
    this.clientId = opts.clientId || null;
    this.physicalId = physicalId;
    this.deviceType = deviceType;
  }

  get device() {
    return {
      keyPath: deviceConfig.certs.keyPath,
      certPath: deviceConfig.certs.certPath,
      caPath: deviceConfig.certs.caPath,
      clientId: `${deviceConfig.deviceType}_${deviceConfig.physicalId}`,
      physicalId: deviceConfig.physicalId,
      deviceType: deviceConfig.deviceType,
      shadow: deviceConfig.iotConnection.shadow,
      host: this.host || deviceConfig.iotConnection.host,
      port: this.port || deviceConfig.iotConnection.port,
      region: this.region || deviceConfig.iotConnection.region,
      timeoutCommission: deviceConfig.timeoutCommission,
      timeoutRequest: deviceConfig.timeoutRequest,
      keepalive: 1800
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
