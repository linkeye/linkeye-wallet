import appCloseIpc from "../ipc/ipcAppCloseMsg";

const { app } = require('electron');
const appClose = _appCloseIpc => ({
  ['app-close'](event, appClose) {
    const requestBack = data => {
      _appCloseIpc.sendToClient('app-close-back', data)
    };
    if(appClose == null) {
      console.log("params appClose is null")
      requestBack({
        success:false,
        error:"params appClose is null",
        errorCode:700,
      })
    } else {
      console.log('get message from front success' + appClose);
      app.quit();
      requestBack({
        success:true,
        closeSuccess:"success",
        errorCode:701,
      })

    }
  }
});

export default appClose
