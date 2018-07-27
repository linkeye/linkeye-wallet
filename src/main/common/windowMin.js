import windowMinIpc from "../ipc/ipcWindowMinMsg";
import { appWindowMin } from '../index'

const windowMin = _windowMinIpc => ({
  ['window-min'](event, windowMin) {
    const requestBack = data => {
      _windowMinIpc.sendToClient('window-min-back', data)
    };
    if(windowMin == null) {
      console.log("params windowMin is null")
      requestBack({
        success:false,
        error:"params windowMin is null",
        errorCode:700,
      })
    } else {
      appWindowMin();
      requestBack({
        success:true,
        closeSuccess:"success",
        errorCode:701,
      })
    }
  }
});

export default windowMin
