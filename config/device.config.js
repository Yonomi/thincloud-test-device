'use strict';

const fs = require('fs');
const path = require('path');
<<<<<<< HEAD
=======
let rootCa = fs.readFileSync(path.join(__dirname, '../rootCA.pem'), 'utf-8');
// endregion

class Config {

  constructor(connectionDetails, physicalId, deviceType, opts) {
    if (!opts) opts = {};
    this.host = connectionDetails.host || null;
    this.region = connectionDetails.region || null;
    this.port = connectionDetails.port || 8883;
    this.clientId = opts.clientId || null;
    this.physicalId = physicalId;
    this.deviceType = deviceType;
  }
>>>>>>> master

// For caching the device config
let device = {};

function getDefaultDeviceConfig() {
  const config = require('./device.config.json');

  const { caCert, clientCert, privateKey } = config;
  const certs = { caCert, clientCert, privateKey };

  const readCerts = Object.keys(certs).reduce((acc, key) => {
    const file = fs.readFileSync(certs[key], 'utf-8');
    acc[key] = Buffer.from(file);
    return acc;
  }, {});

  return Object.assign(config, readCerts);
}

const defaultDeviceConfig = getDefaultDeviceConfig();

// Doing it this way in order to enable 
// the configuration to be cached
module.exports = {

  create: function create(connectionDetails, deviceConfig) {
    const defaults = {
      port: 8883,
      keepalive: 1800
    };

<<<<<<< HEAD
    device = Object.assign(
      defaults,
      defaultDeviceConfig,
      deviceConfig,
      connectionDetails
    );
    this.setClientId(device);
  },

  // Handle special case of clientId
  setClientId: function setClientId(kv) {
    const keys = Object.keys(kv);
    if (
      keys.indexOf('deviceType') !== -1 && 
      keys.indexOf('physicalId') !== -1
    ) {
      device.clientId = `${kv.deviceType}_${kv.physicalId}`;
    }
    return device;
  },
=======
  toJSON() {
    return {
      clientCert: new Buffer(this.clientCert),
      privateKey: new Buffer(this.privateKey),
      caCert: new Buffer(rootCa),
      region: this.region ? this.region : deviceConfig.iotConnection.region,
      host: deviceConfig.iotConnection.host,
      clientId: `${this.deviceType}_${this.physicalId}`,
      physicalId: this.physicalId,
      deviceType: this.deviceType
    };
  }
>>>>>>> master

  get: function get() {
    return device;
  },

  set: function set(key, val) {
    device[key] = val;
    return device;
  },

  // Takes a JSObject/KeyValue Pairs
  update: function update(kv) {
    this.setClientId(kv);
    const keys = Object.keys(kv);

    keys.forEach(key => {
      device[key] = kv[key];
    });
    return device;
  }

};
