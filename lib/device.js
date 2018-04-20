'use strict';

const DeviceSDK = require('@yonomi/thincloud-node-sdk');

class Device extends DeviceSDK {

  constructor(config, logger) {
    super(config);
    this._log = logger.child({
      devicetype: this.devicetype,
      physicalId: this.physicalId
    });
    this._isCommissioned = false;
    this._state = {};
  }

  get devicetype() {
    return this.config.deviceType;
  }

  get physicalId() {
    return this.config.physicalId;
  }

  get isCommissioned() {
    return this._isCommissioned;
  }

  set isCommissioned(val) {
    this._isCommissioned = val;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = Object.assign(this._state, state);
  }

  init(opts) {
    let log = this._log;

    return super.init(opts).then(
      data => {
        log.info({ data }, 'device connected');

        // Add commands and code to implment commands
        this.eventSource.on('command', cmd => {

          if (cmd.method === 'ping') {
            // return command success payload back to cloud
            cmd.success({
              data: { echo: 'pong' }
            });
          }

          if (cmd.method === '_update') {
            if (cmd.params[0].data.custom) {
              this.state = cmd.params[0].data.custom;
              Promise.all([cmd.success(this.state), this.update({ custom: this.state })]);
            }
          }

          if (cmd.method === 'turn_on') {
            this.state = { powerState: true };
            cmd.success({
              custom: {
                powerState: true
              }
            });
          }

          if (cmd.method === 'turn_off') {
            this.state = { powerState: false };
            cmd.success({
              custom: {
                powerState: false
              }
            });
          }

          if (cmd.method === 'toggle_power') {
            let powerState = this.state.powerState ? !this.state.powerState : true;
            this.state = { powerState: powerState };
            cmd.success({
              custom: {
                powerState: this.state.powerState
              }
            });
          }

          if (cmd.method === '_update') {
            if (cmd.params[0].data.custom) {
              this.state = cmd.params[0].data.custom;
              this.update({ custom: this.state });
            }
          }
        });

        return data;
      },
      err => {
        log.error(err);
        this.isCommissioned = false;
      }
    );
  }

  getCommands() {
    let log = this._log;
    return this.request.rpc('get /commands?state=PENDING&sort=desc', [{}]).then(
      data => {
        log.info({ data: data }, 'get /commands response');
      },
      err => {
        log.info({ err: err }, 'get /commands error');
      }
    );
  }

  update(data) {
    let log = this._log;
    return this.request.rpc('put', [data]).then(
      data => {
        if (data.result && data.result.body) {
          this.state = data.result.body.custom || {};
        }
        log.info({ state: this.state }, 'device state response');
      },
      err => {
        log.error({ state: this.state, error: err }, 'request failed');
      }
    );
  }

  get() {
    let log = this._log;
    return this.request.rpc('get', [{}]).then(
      data => {
        log.info({ data: data }, 'get device state response');
        return data;
      },
      err => {
        log.error({ error: err }, 'get request failed');
        return err;
      }
    );
  }

  stream(data, interval) {
    let _this = this;
    setInterval(() => {
      return _this.update({
        attributes: {
          lockState: _this.counter
        }
      });
    }, interval);
  }

  toJSON() {
    return {
      physicalId: this.physicalId,
      devicetype: this.devicetype,
      deviceId: this.deviceId,
      isCommissioned: this.isCommissioned,
      isConnected: this.isConnected,
      state: this.state
    };
  }

}

module.exports = Device;
