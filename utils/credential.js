'use strict';

//region imports
const aws = require('aws-sdk');
let iot = new aws.Iot();
//endregion

class CredentialManager {
  static create(){
    return Promise.resolve()
      .then(Promise.all([
        CredentialService.create,
        PolicyService.getDefault
      ]))
      .then(data => CredentialService.attachPolicy(data[0], data[1]))
      .then(data => {
        return data.credential;
      });
  };
};

class CredentialService {

  static create(){
    return new Promise((resolve, reject) => {
      iot.createKeysAndCertificate({setAsActive: true}, (err, data) => {
        if (err) reject(err);
        else resolve(data)
      });
    });
  };

  static attachPolicy(credential, policy){
    let params = {
      principal: credential.certificateArn,
      policyName: policy.policyId
    };
    return new Promise((resolve, reject) => {
      iot.attachPrincipalPolicy(params, (err, data) => {
        if (err) reject(err);
        else resolve({
          credential: credential,
          policy: policy
        });
      });
    });
  };

};

class PolicyService{
  constructor(){}

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
  static get(params){
    return new Promise((res, rej)=>{
      lib.aws.iot.getPolicy(params,(err, data)=>{
        if (err) rej(err);
        else res(new Policy(data));
      });
    });
  };

  static getById(id){
    return this.get({policyName: id});
  };

  static getDefault(){
    return this.getById('default');
  };
};

class Policy {
  constructor(data){
    Object.assign(this,data);
    this.policyId = this.policyName;
  };
};

class Credential{
  constructor(data){
    Object.assign(this, data);
    this.certificateId = this.certificateArn.split('/')[1];
  };
};

//region exports
module.exports = CredentialManger;
//endregion
