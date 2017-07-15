'use strict';

// region imports
const deviceConfig = require('./device.config.json');
// endregion

class Config {

  static get device() {
    return {
      keyPath: deviceConfig.certs.keyPath,
      certPath: deviceConfig.certs.certPath,
      caPath: deviceConfig.certs.caPath,
      clientId: deviceConfig.iotConnection.clienId,
      region: deviceConfig.iotConnection.region,
      physicalId: deviceConfig.physicalId,
      deviceType: deviceConfig.deviceType,
      shadow: deviceConfig.iotConnection.shadow,
      timeoutCommission: deviceConfig.timeoutCommission,
      timeoutRequest: deviceConfig.timeoutRequest
    };
  }

}

// region exports
module.exports = Config;
// endregion
