'use strict';

const fs = require('fs');
const path = require('path');

// For caching the device config
let device = {};

function getDefaultDeviceConfig() {
  const config = require('./device.config.json');

  const { caCert, clientCert, privateKey } = config;
  const certs = { caCert, clientCert, privateKey };

  const readCerts = Object.keys(certs).reduce((acc, key) => {
    acc[key] = fs.readFileSync(certs[key], 'utf-8');
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
