const {SEVER_IP, SEVER_PORT} = require('../constants/constants')
import { app, BrowserWindow, ipcMain } from 'electron'
import ipcCreateAccountMsg from './ipc/ipcCreateAccountMsg'
import ipcCreateAccountName from './ipc/ipcCreateAccountNameMsg'
import ipcRecordInfo from './ipc/ipcRecordMsg'
import ipcSendTransaction from './ipc/ipcSendMsg'
import ipcGetBalance from './ipc/ipcBalanceMsg'
import ipcGenerateAccount from './ipc/ipcGenerateAccountMsg'
import ipcAccountList from './ipc/ipcAccountList'
import ipcAffirmTransaction from './ipc/ipcAffirmTransaction'
import ipcNormalSetting from './ipc/ipcNormalSettingMsg'
import ipcAccountSetting from './ipc/ipcAccountSettingMsg'
import ipcCreateDatabaseTabe from './ipc/ipcCreateDatabaseTableMsg'
import ipcCreateLoginMsg from './ipc/ipcCreateLoginMsg'
import ipcMarkPage from './ipc/ipcMarkPage'
import ipcImportPrivateKey from './ipc/ipcImportKeyMsg'
import ipcExportPrivateKey from './ipc/ipcExportKeyMsg'
import ipcStorePrivateKey  from './ipc/ipcStorePrivateKeyMsg'
import ipcGeneratePath from './ipc/ipcGeneratePathMsg'
import ipcQueryBlock from './ipc/ipcQueryBlockMsg'
import ipcExportKeystore from './ipc/ipcExportKeystoreMsg'
import ipcImportKeystore from './ipc/ipcImportKeystoreMsg'
import ipcAppClose from './ipc/ipcAppCloseMsg'
import ipcWindowMin from './ipc/ipcWindowMinMsg'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;

const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9089' +
  ''
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize:false,
    height:580,
    width:960,
    webPreferences: {
      webSecurity:false,
    },
    frame: false
  });
  mainWindow.show();
  mainWindow.setResizable(false)
  mainWindow.setMaximizable(false)
  mainWindow.loadURL(winURL);
  // mainWindow.on('closed', () => {
  //   mainWindow = null;
  // });
  new ipcCreateAccountMsg(ipcMain, mainWindow.webContents);
  new ipcCreateAccountName(ipcMain, mainWindow.webContents);
  new ipcRecordInfo(ipcMain, mainWindow.webContents);
  new ipcSendTransaction(ipcMain, mainWindow.webContents);
  new ipcGetBalance(ipcMain, mainWindow.webContents);
  new ipcGenerateAccount(ipcMain, mainWindow.webContents);
  new ipcAccountList(ipcMain, mainWindow.webContents);
  new ipcAffirmTransaction(ipcMain, mainWindow.webContents);
  new ipcNormalSetting(ipcMain, mainWindow.webContents);
  new ipcAccountSetting(ipcMain, mainWindow.webContents);
  new ipcCreateDatabaseTabe(ipcMain, mainWindow.webContents);
  new ipcCreateLoginMsg(ipcMain, mainWindow.webContents);
  new ipcMarkPage(ipcMain, mainWindow.webContents);
  new ipcImportPrivateKey(ipcMain, mainWindow.webContents);
  new ipcExportPrivateKey(ipcMain, mainWindow.webContents);
  new ipcStorePrivateKey(ipcMain, mainWindow.webContents);
  new ipcGeneratePath(ipcMain, mainWindow.webContents);
  new ipcQueryBlock(ipcMain, mainWindow.webContents);
  new ipcExportKeystore(ipcMain, mainWindow.webContents);
  new ipcImportKeystore(ipcMain, mainWindow.webContents);
  new ipcAppClose(ipcMain, mainWindow.webContents);
  new ipcWindowMin(ipcMain, mainWindow.webContents);
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

export const appWindowMin = function () {
    mainWindow.minimize();
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
