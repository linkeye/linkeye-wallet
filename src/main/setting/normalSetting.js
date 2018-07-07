import ipcNormalSetting from '../ipc/ipcNormalSettingMsg'
const { shell } = require('electron');
const dbInit = require('../sqlite/init');

const normalSetting = _normalSettingIpc => ({
  ['normal-setting'](event, normalSettingPd) {
    const requestBack = data => {
      _normalSettingIpc.sendToClient('normal-setting-back', data)
    };
    if(normalSettingPd == null) {
      console.log("get normalSettingPd from front fail and normalSettingPd is null")
    }else {
      console.log("get old password from front success and old password is " + normalSettingPd.oldPassword);
      console.log("get new password from front success and the new password is " + normalSettingPd.newPassword);
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null")
        requestBack({
          success: false,
          error:"Database handle is null",
          errorCode:920,
        })
      } else {
        console.log("start to operate database");
        var sql = "SELECT login_passwd FROM login where login_id ='linkeyeID'";
        db.each(sql, function w(err, row) {
          console.log("Query login_passwd success and login password is " + row.login_passwd)
          if(row.login_passwd == normalSettingPd.oldPassword) {
            console.log("login passwd is equal to old password");
            var modify=db.prepare("UPDATE login set login_passwd = ? where login_id = ?");
            modify.run(normalSettingPd.newPassword, "linkeyeID");
            modify.finalize();
            requestBack({
              success: true,
              normalSettingMsg:"success",
            })
          } else {
            requestBack({
              success: false,
              error:"old password is wrong",
              errorCode:921
            })
          }
        });
      }
    }
  }
});

export default normalSetting
