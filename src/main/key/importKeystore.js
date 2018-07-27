import importKeystoreIpc from "../ipc/ipcImportKeystoreMsg";
const {KEYSTOR_PATH} = require('../../constants/constants')

const keythereum = require('keythereum');
var UUID = require('uuid');
const dbInit = require('../sqlite/init');
const fs = require('fs');


function generateAccountNaem(randomFlag, min, max){
  var str = "", range = min, arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  if(randomFlag){
    range = Math.round(Math.random() * (max-min)) + min;
  }
  for(var i=0; i<range; i++){
    var pos = Math.round(Math.random() * (arr.length-1));
    str += arr[pos];
  }
  return str;
}

const importKeystore = _importKeystoreIpc => ({
  ['import-keystore'](event, importKeystore) {
    const requestBack = data => {
      _importKeystoreIpc.sendToClient('import-keystore-back', data)
    };
    if(importKeystore == null) {
      console.log("Receive front import keystore is null")
      requestBack({
        success: false,
        error:"params is null",
        errorCode:600
      })
    } else {
      console.log("Receive front password success and password is " + importKeystore.password);
      console.log("Receive front private key path success and private key path is " + importKeystore.keystorePath);
      if (!fs.existsSync(KEYSTOR_PATH)) {
        fs.mkdirSync(KEYSTOR_PATH);
        console.log("create keystore directry success and keystore directory is " + KEYSTOR_PATH);
      }

      var keystoreFront = fs.readFileSync(importKeystore.keystorePath, "utf-8");
      if(keystoreFront == null) {
        console.log("Read file fail")
        requestBack({
          success: false,
          error:"params is null",
          errorCode:600
        })
      }
      console.log("read file content is " + keystoreFront);
      var accountId = UUID.v1();
      var params = { keyBytes:32, ivBytes:16 };
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
      var keyObj = JSON.parse(keystoreFront)
      console.log("key object is " + keyObj)
      keythereum.recover(importKeystore.password, keyObj, function(privateKey){
        console.log("generate private key success, private key is " + privateKey);
        if(privateKey == "Error: message authentication code mismatch"){
          console.log("password is wrong, can not generate private key")
          requestBack({
            success: false,
            error: "keyObject is null",
            errorCode:600000
          })
        } else {
          var keyObject = keythereum.dump(importKeystore.password, privateKey, dk.salt, dk.iv, options);
          if(keyObject) {
            console.log("keyObject address is ", keyObject.address);
            console.log("private key is ", dk.privateKey.toString('hex'))
            var db = dbInit.checkCreateLinkeyeDb();
            if(!db){
              console.log("db handle is null");
              requestBack({
                success: false,
                error:"db handle is null",
                errorCode:601
              })
            } else {
              var err = dbInit.createAccountTable("account", db);
              if(err == 'errone'){
                console.log('create account table fail');
                requestBack({
                  success: false,
                  error: "create account table fail",
                  errorCode:602
                })
              } else {
                var sql = "SELECT account_address FROM account where account_address = " + "\'" + keyObject.address + "\'";
                db.all(sql, function w(err, row) {
                  console.log("query database success and the length of row is " +  row.length);
                  if(row.length == 0) {
                    var insert = db.prepare("INSERT INTO account(account_id, account_name, account_passwd, account_address, account_keystore, account_ciphertext_private_key) VALUES (?, ?, ?, ?, ?, ?)");
                    insert.run(accountId, generateAccountNaem(true, 7, 7), importKeystore.password, keyObject.address, JSON.stringify(keyObject), keyObject.crypto.ciphertext);
                    insert.finalize();
                    db.close();
                    keythereum.exportToFile(keyObject, KEYSTOR_PATH);
                    requestBack({
                      success: true,
                      generateMsg: "success",
                    })
                  } else {
                    for(var i = 0; i < row.length; i++) {
                      if(row[i].account_address == keyObject.address){
                        requestBack({
                          success:false,
                          error:"account have already existed",
                          errorCode:603,
                        })
                      }
                    }
                  }
                });
              }
            }
          }else{
            requestBack({
              success: false,
              error: "keyObject is null",
              errorCode:604
            })
          }
        }
      });
    }
  }
});

export default importKeystore
