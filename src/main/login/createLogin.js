import createLoginIpc from "../ipc/ipcCreateLoginMsg";

const dbInit = require('../sqlite/init');

const createLogin = _createLoginIpc => ({
  ['login'](event, password) {
    const requestBack = data => {
      _createLoginIpc.sendToClient('login-back', data)
    };

    if(password == null)
    {
      console.log("get login password from front is null");
      requestBack({
        success: false,
        error:"login password is null"
      })
    } else {
      console.log("login password from front is = ", password);
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null")
        requestBack({
          success: false,
          error:"db handle is null",
          errorCode:900
        })
      } else {
        console.log("start to operate database")
        var sql = "SELECT login_passwd, is_login FROM login where login_id = 'linkeyeID'";
        db.each(sql, function w(err, row) {
          console.log("Query login_passwd, is_login success and login_passwd is" + row.login_passwd +" is_login is " + row.is_login)
          if(password == row.login_passwd){
            requestBack({
              success: true,
              loginMsg:row.is_login
            })
          } else {
            requestBack({
              success: false,
              error:"password is not equil",
              errorCode:901
            })
          }
        });
        db.close();
      }
    }
  }
});

export default createLogin
