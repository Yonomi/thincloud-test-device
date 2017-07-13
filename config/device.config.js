'use strict';

//region imports
const device_config = require('./device.config.json');
//endregion

class Config {

  static get device(){
    return {
      keyPath: device_config.certs.keyPath,
      certPath: device_config.certs.certPath,
      caPath: device_config.certs.caPath,
      clientId: device_config.iotConnection.clienId,
      region: device_config.iotConnection.region,
      physicalId: device_config.physicalId,
      deviceType: device_config.deviceType,
      shadow: device_config.iotConnection.shadow,
      timeoutCommission: device_config.timeoutCommission,
      timeoutRequest: device_config.timeoutRequest
    }
  }

};

//region exports
module.exports = Config;
//endregion
