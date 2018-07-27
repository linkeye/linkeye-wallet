import exportKeystoreIpc from "../ipc/ipcImportKeystoreMsg";

const dbInit = require('../sqlite/init');
const keythereum = require('keythereum');

const exportKeystore = _exportKeystoreIpc => ({
  ['export-keystore'](event, exportKeystore) {
    const requestBack = data => {
      _exportKeystoreIpc.sendToClient('export-keystore-back', data)
    };
    if(exportKeystore == null) {
      console.log("Receive front export keystore is null")
      requestBack({
        success:false,
        error:"get keystore params from front is null",
        errorCode:4000
      })
    } else {
      console.log("Receive address from front and the Address is " + exportKeystore.address);
      console.log("Receive address from front and the Address is " + exportKeystore.password);
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null")
        requestBack({
          success: false,
          error:"db handle is null",
          errorCode:4001
        })
      } else {
        console.log("start to operate database");
        var sql = "SELECT account_keystore FROM account where account_address = " + "\'" + exportKeystore.address + "\'";
        db.each(sql, function w(err, row) {
          console.log("Query account_keystore success and account_private_key is" + row.account_keystore)
          var keyObj = JSON.parse(row.account_keystore);
          keythereum.recover(exportKeystore.password, keyObj, function(privateKey){
            console.log("recover private key is " + privateKey);
            if(Buffer.isBuffer(privateKey)){
              requestBack({
                success: true,
                keystore:JSON.stringify(keyObj)
              })
            }else {
              requestBack({
                success:false,
                error:"password is wrong",
                errorCode:4002
              })
            }
          });
        });
        db.close();
      }
    }
  }
});

export default exportKeystore
