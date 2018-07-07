import createAccountIpc from "../ipc/ipcGenerateAccountMsg";

const { shell } = require('electron');
const keythereum = require('keythereum');
const pwd = require('../base/secret');
const dbInit = require('../sqlite/init');

const generateAccount = _generateAccountIpc => ({
  ['generate-account'](event, accountJson) {
    const requestBack = data => {
      _generateAccountIpc.sendToClient('generate-account-back', data)
    };

    if(accountJson == null)
    {
      console.log("get account information fron is null");
      requestBack({
        success: false,
        error:"accountJson is null",
        errorCode:300
      })
    } else {
      console.log("account_id from fron is = ", accountJson.account_id);
      console.log("account_name from fron is = ", accountJson.account_name);
      console.log("account_password from fron is = ", accountJson.account_passwd);
      console.log("account_address from fron is = ", accountJson.account_address);
      console.log("keystore from front is = ",  accountJson.keystore);
      console.log("corypt private key from front is " + accountJson.account_ciphertext_private_key);
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null")
        requestBack({
          success: false,
          error:"db handle is null",
          errorCode:301
        })
      } else {
        var err = dbInit.createAccountTable("account", db);
        if(err == 'errone'){
          console.log('create account table fail');
          requestBack({
            success: false,
            error: "create account table fail",
            errorCode:302
          })
        }else {
          var insert = db.prepare("INSERT INTO account(account_id, account_name, account_passwd, account_address, account_keystore, account_ciphertext_private_key) VALUES (?, ?, ?, ?, ?, ?)");
          insert.run(accountJson.account_id, accountJson.account_name, accountJson.account_passwd, accountJson.account_address, accountJson.keystore, accountJson.account_ciphertext_private_key);
          insert.finalize();
          db.close();
          requestBack({
            success: true,
            generateMsg:"success",
          })
        }
      }
    }
  }
});

export default generateAccount
