import exportPrivateKeyIpc from "../ipc/ipcExportKeyMsg";

const dbInit = require('../sqlite/init');
const keythereum = require('keythereum');

const exportPrivateKey = _exportPrivateKeyIpc => ({
  ['export-privateKey'](event, exportPivateKey) {
    const requestBack = data => {
      _exportPrivateKeyIpc.sendToClient('export-privateKey-back', data)
    };
    if(exportPivateKey == null) {
      console.log("Receive front export private key is null")
      requestBack({
        success:false,
        error:"get private key from front is null",
        errorCode:400
      })
    } else {
      console.log("Receive address from front and the Address is " + exportPivateKey.address);
      console.log("Receive address from front and the Address is " + exportPivateKey.password);
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null")
        requestBack({
          success: false,
          error:"db handle is null",
          errorCode:401
        })
      } else {
        console.log("start to operate database");
        var sql = "SELECT account_keystore FROM account where account_address = " + "\'" + exportPivateKey.address + "\'";
        db.each(sql, function w(err, row) {
          console.log("Query account_keystore success and account_private_key is" + row.account_keystore)
          var keyObj = JSON.parse(row.account_keystore);
          keythereum.recover(exportPivateKey.password, keyObj, function(privateKey){
            console.log("recover private key is " + privateKey);
            if(Buffer.isBuffer(privateKey)){
              requestBack({
                success: true,
                privateKey:privateKey.toString('hex')
              })
            }else {
              requestBack({
                success:false,
                error:"password is wrong",
                errorCode:402
              })
            }
          });
        });
        db.close();
      }
    }
  }
});

export default exportPrivateKey
