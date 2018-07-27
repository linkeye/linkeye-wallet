import storePrivateKeyIpc from "../ipc/ipcStorePrivateKeyMsg";
const fs= require("fs");

const {dialog} = require('electron');

const storePrivateKey = _storePrivateKeyIpc => ({
  ['store-privateKey'](event, storeKey) {
    const requestBack = data => {
      _storePrivateKeyIpc.sendToClient('store-privateKey-back', data)
    };
    if(storeKey == null) {
      console.log("Receive storeKey from front success and store key is null")
      requestBack({
        success:false,
        error:"param storeKey is null",
        errorCode:700,
      })
    } else {
      console.log("Receive storeKey private key from front success and private key is " + storeKey.privateKey);
      var path = dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      var dateTime = year+month+day+hour+minute+second;
      fs.writeFile(path + '/'+ dateTime +'privateKeyOrKeystore.ert', storeKey.privateKey, {flag:'w',encoding:'utf-8',mode:'0666'}, function(err){
        if(err){
          console.log("write private key to file fail")
          requestBack({
            success:false,
            error:"write private key to file fail",
            errorCode:701,
          })
        }else{
          console.log("write private key to file success");
          requestBack({
            success:true,
            writeMsg:"success",
          })
        }
      })
    }
  }
});

export default storePrivateKey
