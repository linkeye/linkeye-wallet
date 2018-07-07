import createLoginIpc from "../ipc/ipcCreateLoginMsg";

const pwd = require('../base/secret');
const dbInit = require('../sqlite/init');
var uuid = require('uuid');

const markPage = _markPageIpc => ({
  ['mark'](event, markFlag) {
    const requestBack = data => {
      _markPageIpc.sendToClient('mark-back', data)
    };
    if(markFlag == null) {
      console.log("get markFlag from front fail because markFlag is null");
    }else{
      console.log("get markFlag from front success and markFlag is " + markFlag);
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null")
        requestBack({
          success: false,
          error:"db handle is null",
          errorCode:902,
        })
      } else {
        var modify=db.prepare("UPDATE login set is_login=? where login_id = 'linkeyeID'")
        modify.run("1")
        modify.finalize();
        db.close();
        requestBack({
          success: true,
          markReslt:"success"
        })
      }
    }
  }
});

export default markPage
