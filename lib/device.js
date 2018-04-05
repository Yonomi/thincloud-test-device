'use strict';

const DeviceSDK = require('@yonomi/thincloud-device-sdk');
// const awsHelper = require('./utils');
const defaultLogger = require('./utils/logger');

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
    this._state = state;
  }

  init(opts) {
    let log = this._log;
    return super.init(opts)
      .then((data) => {
        log.info({data}, 'device connect response');

        // this.eventSource.subscribe(`thincloud/devices/${this.deviceId}/delta`);
        // this.eventSource.subscribe(`thincloud/devices/${this.deviceId}/desired`);
        // this.eventSource.subscribe(`thincloud/devices/${this.deviceId}/reported`);

        log.info({data}, 'device connected');

        // this.stream({}, 10000);
        //
        // this.getCommands();
        // this.get();

        this.eventSource.on('command', (cmd) => {
          if (cmd.method === 'ping') {
            cmd.success({
              data: {'echo': 'pong'}
            });
          }

          if (cmd.method === 'turn_on') {
            this.state = Object.assign(this.state, { powerState: true });
            cmd.success({
              custom: {
                powerState: true
              }
            });
          }

          if (cmd.method === 'turn_off') {
            this.state = Object.assign(this.state, { powerState: false });
            cmd.success({
              custom: {
                powerState: false
              }
            });
          }

          if (cmd.method === 'toggle_power') {
            let powerState = this.state.powerState ? !this.state.powerState : true;
            this.state = Object.assign(this.state, { powerState: powerState });
            cmd.success({
              custom: {
                powerState: this.state.powerState
              }
            });
          }

          if (cmd.method === '_update') {
            if (cmd.params[0].data.custom) {
              this.state = Object.assign(this.state, cmd.params[0].data.custom);
              this.update({
                custom: {
                  lockstate: cmd.params[0].data.custom.lockstate
                }
              });
            }

          }
        });

        // this._addRelatedDevice({
        //   deviceId: '2746682c-f39c-4d21-82e1-1196333f1313',
        //   deviceType: 'be479',
        //   physicalId: '0001',
        // }).then((data) => {
        //   console.log(data);
        // }, (err) => {
        //   console.log(err);
        // });

        // this.eventSource.register(this.deviceId, {}, () => console.log);

        // this.eventSource.on('delta', (thingName, stateObject)=>{
        //   console.log(thingName, JSON.stringify(stateObject.state));
        // });

        // this.eventSource.on(`thincloud/devices/${this.deviceId}/delta`, (data) => {
        //   console.log('delta', JSON.stringify(data));
        // });
        //
        // this.eventSource.on(`thincloud/devices/${this.deviceId}/desired`, (data) => {
        //   console.log('desired', JSON.stringify(data));
        // });
        //
        // this.eventSource.on(`thincloud/devices/${this.deviceId}/reported`, (data) => {
        //   console.log('reported', JSON.stringify(data));
        // });

        // this.request.registration('commission', [{
        //   data: {
        //     deviceId: '568467be-7bb4-4139-88d8-8e0778d07df7',
        //     deviceType: 'be479',
        //     physicalId: '0001',
        //     relatedDevices:[{
        //       deviceId: '817d0c19-e1a4-5528-93a3-686835e10845',
        //     }]
        //   }
        // }], {
        //   deviceId: 'be479_0001'
        // }).then((data)=>
        //     console.log(data),
        //   (err)=>
        //     console.log(err)
        // );
        //
        // this.request.registration('commission', [{
        //   data: {
        //     deviceId: 'de3fd12b-81e7-409c-a245-2ae0eb7db20d',
        //     deviceType: 'be479',
        //     physicalId: '0000',
        //     relatedDevices:[{
        //       deviceId: '817d0c19-e1a4-5528-93a3-686835e10845',
        //     }]
        //   }
        // }], {
        //   deviceId: 'be479_0000'
        // }).then((data)=>
        //     console.log(data),
        //   (err)=>
        //     console.log(err)
        // );

        return data;

      }, (err) => {
        log.error(err)
        this.isCommissioned = false;
      });
  }

  getCommands() {
    let log = this._log;
    this.request
      .rpc('get /commands?state=PENDING&sort=desc', [{}])
      .then(data => {
        log.info({data: data}, 'get /commands response');
      }, err => {
        log.info({err: err}, 'get /commands error');
      });
  }

  update(data) {
    let log = this._log;
    this.request
      .rpc('put', [data])
      .then(data => {
        if (data.result && data.result.body) {
          this.state = data.result.body;
        }
        log.info({state: this.state}, 'device state response');
      }, err => {
        log.error({state: this.state, error: err}, 'request failed');
      });
  }

  get() {
    let log = this._log;
    return this.request
      .rpc('get', [{}])
      .then(data => {
        log.info({data: data}, 'get device state response');
        return data;
      }, err => {
        log.error({error: err}, 'get request failed');
        return err;
      });
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
