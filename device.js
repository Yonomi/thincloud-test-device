'use strict';

module.exports = class Device {

  constructor(...args) {
    console.log('...', args);
    // create IoT cert if not provided
  }

  run() {
    // optionally load express app and listen
    // run device sdk
  }

  cleanup() {
    // remove IoT certs, policies, shadows, etc.
  }

};
