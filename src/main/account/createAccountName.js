import CreateAccountName from '../ipc/ipcCreateAccountNameMsg'
import executeQuerySql from "../sqlite/sqlite";
const { shell } = require('electron');
var UUID = require('uuid');

const createAccountName = _createAccountNameIpc => ({
  ['account-name'](event, accountName) {
      const requestBack = data => {
        _createAccountNameIpc.sendToClient('account-name-back', data)
      };

    if(accountName != null) {
      console.log("get account name from front is " + accountName);
      requestBack({
        success: true,
        succMsg:UUID.v1()
      });
    }else {
      requestBack({
        success: false,
        error:"Have you already input you name",
        errorCode:100
      });
    }
  }
});

export default createAccountName
