import accountListIpc from '../ipc/ipcAccountList'
const { shell } = require('electron');
const dbInit  = require('../sqlite/init');

const accountList = _accountListIpc => ({
  ['get-accounts'](event, accounts) {
    const requestBack = data => {
      _accountListIpc.sendToClient('get-accounts-back', data)
    };
    if(accounts == null)
    {
      console.log("accounts is null");
      requestBack({
        success: false,
        error:"accounts is null",
        errorCode:903
      });
    }else {
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null");
        requestBack({
          success: false,
          error:"db handle is null",
          errorCode:904
        });
      }
      var sql = "select account_id, account_name, account_address from account";
      db.all(sql, function(err, res) {
        if(!err) {
          var accountLists = JSON.stringify(res);
          console.log("Get record from database is " + accountLists);
          requestBack({
            success: true,
            accountList:accountLists
          })
        } else {
          console.log("error occur， error is" + err);
          requestBack({
            success: false,
            error:err,
            errorCode:905
          });
          console.log(err);
        }
      });
    }
  }
});

export default accountList
