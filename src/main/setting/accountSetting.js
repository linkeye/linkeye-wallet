import ipcAccountSetting from '../ipc/ipcAccountSettingMsg'
const {KEYSTOR_PATH} = require('../../constants/constants')
const { shell } = require('electron');
const dbInit = require('../sqlite/init');
const keythereum = require('keythereum');
const fs = require('fs');


const normalSetting = _accountSettingIpc => ({
  ['account-setting'](event, accountSetting) {
    const requestBack = data => {
      _accountSettingIpc.sendToClient('account-setting-back', data)
    };
    if(accountSetting == null) {
      console.log("get accountSetting from front fail and accountSetting is null")
      requestBack({
        success: false,
        error:"db handle is null",
        errorCode:999,
      })
    }else {
      console.log("get address from front success and address is " + accountSetting.address);
      console.log("get old password from front success and old password is " + accountSetting.lastPassword);
      console.log("get new password from front success and new password is " + accountSetting.password);
      if (!fs.existsSync(KEYSTOR_PATH)) {
        fs.mkdirSync(KEYSTOR_PATH);
        console.log("create keystore directry success and keystore directory is " + KEYSTOR_PATH);
      }
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null")
        requestBack({
          success: false,
          error:"db handle is null",
          errorCode:911,
        })
      } else {
        console.log("start to operate database")
        var sql = "SELECT account_passwd, account_keystore FROM account where account_address = " + "\'" + accountSetting.address + "\'";
        db.each(sql, function w(err, row) {
          console.log("Query account_passwd success and account_passwd is" + row.account_passwd);
          console.log("Query account_keystore success and account_keystore is" + row.account_keystore);
          if(row.account_passwd == accountSetting.lastPassword) {
            var keyObj = JSON.parse(row.account_keystore);
            keythereum.recover(accountSetting.lastPassword, keyObj, function(privateKey){
              console.log("recover private key througth keystore success and private key is " + privateKey)
              var params = { keyBytes: 32, ivBytes: 16 };
              keythereum.create(params, function (dk) {
                var options = {
                  kdf: "pbkdf2",
                  cipher: "aes-128-ctr",
                  kdfparams: {
                    c: 262144,
                    dklen: 32,
                    prf: "hmac-sha256"
                  }
                };
                keythereum.dump(accountSetting.password, privateKey, dk.salt, dk.iv, options, function (keyObject) {
                 if(keyObject != null) {
                   var modify=db.prepare("UPDATE account set account_passwd = ?, account_keystore = ?, account_ciphertext_private_key = ? where account_address = ?");
                   modify.run(accountSetting.password, JSON.stringify(keyObject), keyObject.crypto.ciphertext, accountSetting.address);
                   modify.finalize();
                   db.close();
                   requestBack({
                     success: true,
                     accountSettingMsg:"success"
                   });
                   keythereum.exportToFile(keyObject, KEYSTOR_PATH);
                 } else {
                   requestBack({
                     success: false,
                     error:"generate keystore fail",
                     errorCode:912,
                   })
                 }
                });
              });
            });
          } else {
            requestBack({
              success: false,
              error:"old password is wrong",
              errorCode:913,
            });
          }
        });
      }
    }
  }
});

export default normalSetting
