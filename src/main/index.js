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
var schedule = require('node-schedule');
const http = require('http');
const dbInit = require('./sqlite/init');

var rule = new schedule.RecurrenceRule();
var times = [];
for(var i = 1; i < 60; i += 5){
  times.push(i);
}
rule.second = times;

var j = schedule.scheduleJob(rule, function(){

  var db = dbInit.checkCreateLinkeyeDb();
  if(!db){
    console.log("db handle is null")
    return ;
  } else {
    var errThree = dbInit.createSendTable("record", db);
    if(errThree == "errtwo"){
      console.log('create record table fail');
      return ;
    }
  }
  var body = {
    "jsonrpc": "2.0",
    "method": "let_blockNumber",
    "params":[],
    "id":83
  };
  var bodyString = JSON.stringify(body);
  var headers = {
    'Content-Type':'application/json',
    'Content-Length':bodyString.length
  };
  var options = {
    host:SEVER_IP,
    port:SEVER_PORT,
    path:'',
    method:'POST',
    headers:headers
  };
  var req = http.request(options, function (res) {
    res.setEncoding('utf-8');
    var responseString = '';
    res.on('data', function (data) {
      responseString += data;
      console.log("get block number from wallet node success and back data is " + data)
      var blockNumberStr = JSON.parse(data);
      var blockNumber = parseInt(blockNumberStr.result, 16);
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null")
      } else {
        console.log("start to operate database")
        var sql = "SELECT send_id, account_id, send_time, account_addr_from, account_addr_to, send_balance, service_charge, comment, send_status, block_number " +
          "FROM record where send_status = '1'";
        db.all(sql, function w(err, row) {
          console.log("Query record database success and the data is" + JSON.stringify(row))
          var recordInfo = JSON.stringify(row);
          for(var i = 0; i < row.length; i++) {
            if(blockNumber - parseInt(row[i].block_number) > 3) {
              var modify=db.prepare("UPDATE record set send_status=?, block_number=? where send_id = ?")
              modify.run("0", row[i].block_number ,row[i].send_id)
              modify.finalize();
            }
          }
        });
        db.close();
      }
      console.log("block number from wallet is " + blockNumber);
    });

    res.on('end', function (res) {
      console.log("response end");
    });
    req.on('error', function (e) {
      console.log('error occur,error is', e);
    });
  });
  req.write(bodyString);
  req.end();
});


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
    height: 800,
    useContentSize:true,
    width: 960,
    webPreferences: {
      webSecurity: false,
    },
  });
  mainWindow.loadURL(winURL);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
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
