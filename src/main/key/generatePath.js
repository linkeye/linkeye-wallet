import generatePathIpc from "../ipc/ipcGeneratePathMsg";

const {dialog} = require('electron');

const generatePath = _generatePathIpc => ({
  ['generate-file-path'](event, filePath) {
    const requestBack = data => {
      _generatePathIpc.sendToClient('generate-file-path-back', data)
    };
    if(filePath == null) {
      console.log("Receive front filePath is null")
      requestBack({
        success:false,
        error:"filePath is null",
        errorCode:500
      })
    } else {
      console.log("Receive filePath from front and the filePath is " + filePath);
      var path = dialog.showOpenDialog({properties: ['openFile', 'openFile', 'multiSelections']});
      if(path == null) {
        requestBack({
          success:false,
          error:"path is null",
          errorCode:501
        })
      } else {
        requestBack({
          success:true,
          filePath:path
        })
      }
    }
  }
});

export default generatePath
