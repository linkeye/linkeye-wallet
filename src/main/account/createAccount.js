import createAccountIpc from "../ipc/ipcCreateAccountMsg";
const {KEYSTOR_PATH} = require('../../constants/constants')

const keythereum = require('keythereum');
const pwd = require('../base/secret');
const fs = require('fs');

const createAccount = _createAccountIpc => ({
  ['generate-keystore'](event, passwd) {
    const requestBack = data => {
      _createAccountIpc.sendToClient('back-privateKey', data)
    };
    if(passwd == null) {
      console.log("Receive password from front is null")
      requestBack({
        success: false,
        error: "password is null",
        errorCode:201
      })
    } else {
      if (!fs.existsSync(KEYSTOR_PATH)) {
        fs.mkdirSync(KEYSTOR_PATH);
        console.log("create keystore directry success and keystore directory is " + KEYSTOR_PATH);
      }
      var params = { keyBytes: 32, ivBytes: 16 };
      var dk = keythereum.create(params);
      var options = {
        kdf: "pbkdf2",
        cipher: "aes-128-ctr",
        kdfparams: {
          c: 262144,
          dklen: 32,
          prf: "hmac-sha256"
        }
      };
      var keyObject = keythereum.dump(passwd, dk.privateKey, dk.salt, dk.iv, options);
      if(keyObject) {
        console.log("keyObject address is ", keyObject.address);
        console.log("private key is ", dk.privateKey.toString('hex'))
        keythereum.exportToFile(keyObject, KEYSTOR_PATH);
        requestBack({
          success: true,
          privateKey:{"address":keyObject.address, "privateKey":dk.privateKey.toString('hex'), "keystore":JSON.stringify(keyObject), "ciphertextPrivateKey":keyObject.crypto.ciphertext},
        })
      }else {
        requestBack({
          success: false,
          error: "keyObject is null",
          errorCode:202
        })
      }
    }
  }
});

export default createAccount
