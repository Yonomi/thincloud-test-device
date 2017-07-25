'use strict';

const DeviceSDK = require('@yonomi/thincloud-device-sdk');
// const awsHelper = require('./utils');
const defaultLogger = require('./utils/logger');

class Device extends DeviceSDK {
  constructor(config, logger){
    super(config);
    this._log = logger.child({
      devicetype: this.devicetype,
      physicalId: this.physicalId
    });
    this._counter = 0;
  }

  get devicetype(){
    return this.config.deviceType;
  }

  get physicalId(){
    return this.config.physicalId;
  }

  get state(){
    return this._state;
  }

  set state(state){
    this._state = state
  }

  get counter(){
    return this._counter = this._counter + 1;
  }

  set counter(val){
    this._counter = val;
  }

  init(){
    let log = this._log;
    super.init()
      .then((data)=>{
        log.info({data}, 'device registration response');

        if (data.result.statusCode !== 200) {
          throw new Error('Failed to register');
        }

        log.info({data}, 'device connected');

        this.stream({}, 10000);

        this.eventSource.on('commands', (cmd) => {
          log.info({cmd}, 'device command received');
        });

        return data;

      }).catch(err => {
        log.error(err, 'unable to bootstrap device');
        this.disconnect();
      });
  }

  update(data){
    let log = this._log;
    this.request
      .rpc('put', [data])
      .then(data => {
        if(data.result && data.result.body){
          this.state = data.result.body;
        }
        log.info({state: this.state}, 'device state response');
      })
  }

  stream(data, interval){
    let _this = this;
    setInterval(() => {
      return _this.update({
        attributes: {
          lockState: _this.counter
        }
      })
    }, interval);
  }

}

module.exports = Device;

// //
//
// module.exports = class Device {
//
//   constructor({
//                 devicetype, physicalId, connection = {}, deviceInfo = {},
//                 pollInterval,
//                 port,
//                 logger = defaultLogger
//               } = {}) {
//     // { shops: { cakeShop: {name: CakeShopName} = {}, pieShop: {name: PieShopName} = {} }
//
//     // create IoT cert if not provided
//     this._deviceObject = {
//       devicetype: devicetype || deviceInfo.devicetype,
//       physicalId: physicalId || deviceInfo.physicalId
//     };
//
//     this._config = {deviceInfo, pollInterval};
//     this._server = port ? {app: require('./app'), port} : null;
//     this._client = new DeviceSDK(this._config.deviceInfo);
//     this._log = logger.child({
//       devicetype: this.devicetype,
//       physicalId: this.physicalId
//     });
//   }
//
//   get devicetype() {
//     return this._deviceObject.devicetype;
//   }
//
//   get physicalId() {
//     return this._deviceObject.physicalId;
//   }
//
//   get deviceId() {
//     return this._deviceObject.deviceId;
//   }
//
//   get active() {
//     return this._deviceObject.active;
//   }
//
//   get createdAt() {
//     return this._deviceObject.createdAt;
//   }
//
//   get updatedAt() {
//     return this._deviceObject.updatedAt;
//   }
//
//   get relatedDevices() {
//     return this._deviceObject.relatedDevices || [];
//   }
//
//   get users() {
//     return this._deviceObject.users || [];
//   }
//
//   get state() {
//     return this._deviceObject.custom || {};
//   }
//
//   set state(value) {
//     if (
//       !(function isObject(value) {
//         const type = typeof value;
//         return value != null && (type === 'object' || type === 'function');
//       })(value)
//     ) {
//       throw new Error('Bad Value');
//     }
//
//     const newState = Object.assign({}, this._deviceObject.custom, value);
//     this._deviceObject.custom = newState;
//
//     this._client.request.publish('put', [{custom: newState}]).catch(err => {
//       this._log.warn({err}, 'failed to publish state');
//     });
//   }
//
//   get lastPing() {
//     let ping = null;
//     try {
//       ping = this._lastPing.toISOString();
//     } catch (err) {
//       this._log.debug(
//         {err, ping: this._lastPing},
//         'unable to convert lastPing'
//       );
//     }
//     return ping;
//   }
//
//   run() {
//     const log = this._log;
//
//     this._client
//       .init()
//       .then((data = {}) => {
//         log.debug({data}, 'device registration response');
//
//         if (data.result.statusCode !== 200) {
//           throw new Error('Failed to register');
//         }
//
//         this._deviceObject.deviceId = data.result.deviceId;
//         this._log = this._log.child({deviceId: this.deviceId});
//
//         log.info('device connected');
//
//         pollDeviceState.bind(this)(this._config.pollInterval);
//
//         this._client.eventSource.on('commands', cmd => {
//           log.info({cmd}, 'device command received');
//           executeCommand.bind(this)(cmd).catch(err => {
//             log.error({err}, 'failed to publish command response');
//           });
//         });
//       })
//       .then(() => {
//         // optionally load express app and listen
//         const app = this._server.app;
//         if (app) {
//           app({device: this}).listen(this._server.port, err => {
//             if (err) throw err;
//             log.info({port: this._server.port}, 'server listening');
//           });
//         }
//       })
//       .catch(err => {
//         log.error(err, 'unable to bootstrap device');
//         this.disconnect();
//       });
//   }
//
//   disconnect() {
//     return Promise.try(() => {
//       this._log.info('shutdown');
//       // return this._client.disconnect();
//       // remove IoT certs, policies, shadows, etc.
//     });
//   }
//
// };
//
// //
//
// function pollDeviceState(interval = 10000) {
//   const log = this._log;
//   log.debug({interval}, 'poll state');
//
//   const poll = () => {
//     let counter = isNaN(this.state.counter) ? 0 : this.state.counter;
//
//     this._client.request
//       .rpc('put', [{custom: {counter: ++counter}}])
//       .then(data => {
//         log.debug({data}, 'device state response');
//
//         this._lastPing = new Date();
//
//         if (data.result && data.result.statusCode) {
//           const newObjectData = {
//             // shouldn't update deviceId, devicetypeId, or physicalId
//             custom: data.result.body.custom || {},
//             active: !!data.result.body.active,
//             relatedDevices: data.result.body.relatedDevices,
//             users: data.result.body.users,
//             updatedAt: data.result.body.updatedAt,
//             createdAt: data.result.body.createdAt
//           };
//
//           Object.assign(this._deviceObject, newObjectData, {});
//         }
//       });
//   };
//
//   poll();
//   if (interval) {
//     return setInterval(poll, interval);
//   }
// }
//
// function executeCommand(cmd) {
//   const log = this._log.child({requestId: cmd.requestId});
//
//   return Promise.try(() => {
//     switch (cmd.method) {
//
//       case 'set_name':
//         setName.apply(this, cmd.params);
//         break;
//       case 'power_off':
//         powerOff.apply(this, cmd.params);
//         break;
//       case 'power_on':
//         powerOn.apply(this, cmd.params);
//         break;
//       default:
//         throw new Error(`unknown command: ${cmd.method}`);
//
//     }
//   })
//     .then(data => {
//       return {result: data};
//     })
//     .catch(err => {
//       log.warn({cmd, err}, 'unable to execute command');
//       return {error: true};
//     })
//     .finally(payload => {
//       cmd.respond(cmd.id, payload);
//     });
// }
//
// function setName({name}) {
//   this.state.name = typeof name === 'string' || name instanceof String
//     ? name
//     : this.state.name;
// }
//
// function powerOff() {
//   const state = {
//     power: false,
//     level: null
//   };
//   this.state = state;
// }
//
// function powerOn({level = 100} = {}) {
//   const state = {
//     power: true,
//     level: !isNaN(level) && level > 0 && level <= 100 ? level : 100
//   };
//   this.state = state;
// }
