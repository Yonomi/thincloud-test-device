'use strict';

// region imports
const aws = require('aws-sdk');
const config = require('./config');
let iot = new aws.Iot({
  accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
  secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
  region: config.get('AWS_REGION'),
  // endpoint: ,
});
// endregion

class CredentialManager {

  constructor(){
    this.credential = null;
  }

  create() {
    return Promise.resolve()
      .then(data => Promise.all([CredentialService.create(), PolicyService.getDefault()]))
      .then(data => CredentialService.attachPolicy(data[0], data[1]))
      .then(data => {
        this.credential = new Credential(data.credential);
        return data.credential;
      })
  }

  get(){
    return !this.credential
      ? this.create()
      : Promise.resolve(this.credential);
  }

  delete(){
    return !this.credential
      ? null
      : CredentialService.forceDelete(this.credential);
  }

}

class CredentialService {

  static create() {
    return new Promise((resolve, reject) => {
      iot.createKeysAndCertificate({ setAsActive: true }, (err, credential) => {
        if (err) reject(err);
        else resolve(new Credential(credential));
      });
    });
  }

  static delete(credential){
    return new Promise((resolve, reject) =>{
      iot.deleteCertificate({
        certificateId: credential.certificateId
      }, (err, data) => {
        if(err) reject(err);
        else resolve(data)
      })
    })
  }

  /**
   *
   * @param certId
   * @return {Promise.<TResult>}
   */
  static forceDelete(credential) {
    return Promise.resolve()
      .then(data => this.detachAll(credential))
      .then(data => this.deactivate(credential))
      .then(data => this.delete(credential))
  }

  /**
   * @param certId
   * @return {Promise.<TResult>}
   */
  static detachAll(credential) {
    return Promise.resolve(credential)
      .then(credential => this.getAssociateIds(credential))
      .then(associates => this.detachAssociates(credential, associates.deviceIds, associates.policyIds))
  }

  /**
   *
   * @param credential
   * @return {Promise.<TResult>}
   */
  static getAssociateIds(credential) {
    return Promise.all([
      this.getDeviceIds(credential),
      this.getPolicyIds(credential)
    ]).then((data)=> {
      return {
        deviceIds: data[0],
        policyIds: data[1]
      }
    })
  }

  /**
   *
   * @param credential
   * @return {Promise}
   */
  static getDeviceIds(credential) {
    let params = {
      principal: credential.certificateArn
    };
    return new Promise((res, rej)=> {
      iot.listPrincipalThings(params, (err, data)=> {
        if (err) rej(err);
        else res(data.things);
      })
    })
  }

  /**
   *
   * @param credential
   * @return {Promise}
   */
  static getPolicyIds(credential) {
    let params = {
      principal: credential.certificateArn
    };
    return new Promise((res, rej)=> {
      iot.listPrincipalPolicies(params, (err, data)=> {
        if (err) rej(err);
        else res(data.policies.map((policy)=> {
          return policy.policyName
        }));
      })
    })
  }

  /**
   *
   * @param certificateArn
   * @param deviceIds
   * @param policyIds
   * @return {Promise.<*>}
   */
  static detachAssociates(credential, deviceIds, policyIds) {
    return Promise.all([
      this.detachPolicies(credential, policyIds),
      this.detachDevices(credential, deviceIds)
    ])
  }

  /**
   *
   * @param params
   * @return {Promise}
   */
  static _detachPolicy(params) {
    return new Promise((res, rej)=> {
      iot.detachPrincipalPolicy(params, (err, data)=> {
        if (err) rej(err);
        else res(data);
      })
    })
  }

  /**
   *
   * @param params
   * @return {Promise}
   */
  static detachPolicy(params) {
    return this._detachPolicy(params)
      .catch(ex => {
        if (ex.code === 'ResourceNotFoundException') return params
      })
  }

  /**
   *
   * @param certificateArn
   * @param policyIds
   * @return {Promise.<*>}
   */
  static detachPolicies(credential, policyIds) {
    let policies = policyIds.map((policyId)=> {
      return {policyName: policyId, principal: credential.certificateArn}
    });
    return Promise.all(policies.map((policy)=> {
      return this.detachPolicy(policy)
    }));
  }

  /**
   *
   * @param params
   * @return {Promise}
   */
  static _detachDevice(params) {
    return new Promise((res, rej)=> {
      iot.detachThingPrincipal(params, (err, data)=> {
        if (err) rej(err);
        else res(data);
      })
    })
  }

  /**
   *
   * @param params
   * @return {Promise}
   */
  static detachDevice(params) {
    return this._detachDevice(params)
      .catch(ex => {
        if (ex.code === 'ResourceNotFoundException') return params
      })
  }

  /**
   *
   * @param certificateArn
   * @param deviceIds
   * @return {Promise.<*>}
   */
  static detachDevices(credential, deviceIds) {
    let devices = deviceIds.map((deviceId)=> {
      return {thingName: deviceId, principal: credential.certificateArn}
    });
    return Promise.all(devices.map((device)=> {
      return this.detachDevice(device)
    }));
  }



  /**
   * Updates the status of a certificate
   * @param credential{Object}
   * @returns {Promise}
   *  rej - err
   *  res - confirmation
   */
  static deactivate(credential) {
    return new Promise(function (res, rej) {
      iot.updateCertificate({
        certificateId: credential.certificateId,
        newStatus: 'INACTIVE'
      }, (err, data)=> {
        if (err) rej(err);
        else res(data)
      })
    });
  }

  /**
   *
   * @param id
   * @return {Promise}
   */
  static deleteById(id) {
    return this.delete({certificateId: id});
  }

  static attachPolicy(credential, policy) {
    let params = {
      principal: credential.certificateArn,
      policyName: policy.policyId
    };
    return new Promise((resolve, reject) => {
      iot.attachPrincipalPolicy(params, (err, data) => {
        if (err) reject(err);
        else {
          resolve({
            credential: credential,
            policy: policy
          });
        }
      });
    });
  }

  /**
   *
   * @param certificateArn
   * @return {Promise}
   */
  static detachDefault(credential) {
    return new Promise((res, rej)=> {
      iot.detachPrincipalPolicy({
        principal: credential.certificateArn,
        policyName: 'default'
      }, (err, data)=> {
        if (err && err.code === 'ResourceNotFoundException') {
          res({})
        } else if (err) {
          rej(err)
        } else {
          res(data)
        }
      })
    })
  }

}

class PolicyService {

  // constructor() {}

  /**
   * Gets a Policy
   * @param params{Object} - {
          policyName: name
       }
   * @returns {Promise}
   *  rej - err
   *  res - {
     *      policyName: "",
     *      policyArn: "",
     *      policyDocument: "",
     *      defaultVersionId: ""
     *  }
   */
  static get(params) {
    return new Promise((resolve, reject) => {
      iot.getPolicy(params, (err, policy) => {
        if (err) reject(err);
        else resolve(new Policy(policy));
      });
    });
  }

  static getById(id) {
    return this.get({ policyName: id });
  }

  static getDefault() {
    return this.getById('default');
  }

}

class Policy {

  constructor(policy) {
    Object.assign(this, policy);
    this.policyId = this.policyName;
  }

}

class Credential {

  constructor(credential) {
    Object.assign(this, credential);
    this.certificateId = this.certificateArn ? this.certificateArn.split('/')[1] : null;
  }

}

// region exports
module.exports = CredentialManager;
// endregion
