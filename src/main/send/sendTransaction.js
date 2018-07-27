import sendTransactionIpc from '../ipc/ipcSendMsg'
const {SEVER_IP, SEVER_PORT} = require('../../constants/constants')

const dba = require('../sqlite/sqlite');
const dbInit = require('../sqlite/init');
const https=require('https');
const send  = require('../base/sendTranaction');
const pwd = require('../base/secret');
const sendRecord = require('./sendRecord');
const keythereum = require('keythereum');

const sendTransaction = _sendTransactionIpc => ({
  ['send'](event, sendInfo) {
    const requestBack = data => {
      _sendTransactionIpc.sendToClient('send-back', data)
    }
    if(sendInfo == null)
    {
      console.log("Receive front send information error, param sendInfo is null");
      requestBack({
        success:false,
        error:"params is null",
        errorCode:2000
      })
    } else {
      console.log("get account_id from front is + " + sendInfo.accountId)
      console.log("get password from front is " + sendInfo.password);
      console.log("get from address from front is " + sendInfo.fromAddress);
      console.log("get toAddress from front is " + sendInfo.toAddress);
      console.log("get send balance from front is " + sendInfo.sendToBalance);
      console.log("get fee from front is " + sendInfo.sendFee);
      console.log("get send content from front is " + sendInfo.sendContent);
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        requestBack({
          success:false,
          error:"database handle is null",
          errorCode:2001
        });
      } else {
        var sql = "SELECT account_passwd, account_keystore FROM account where account_address = " + "\'" + sendInfo.fromAddress + "\'";
        db.each(sql, function w(err, row) {
          console.log("Query account_password from database, the account_password is " + row.account_passwd);
          console.log("Query account_keystore from database, the account_keystore is " + row.account_keystore);
          if (row.account_passwd == null || row.account_keystore == null) {
            console.log("account password and account keystore is null");
            requestBack({
              success:false,
              error:"one of param is null",
              errorCode:2002
            })
          } else {
            console.log("account password is " + row.account_passwd);
            if(row.account_passwd == sendInfo.password) {
              console.log("two password is equal");
              var keyObj = JSON.parse(row.account_keystore);
              keythereum.recover(sendInfo.password, keyObj, function (privateKey) {
                var body = {
                  "jsonrpc":"2.0",
                  "method":"let_getTransactionCount",
                  "params":['0x'+ sendInfo.fromAddress, "latest"],
                  "id":1
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
                var req = https.request(options, function (res) {
                  res.setEncoding('utf-8');
                  var responseString = '';
                  res.on('data', function (data) {
                    responseString += data;
                    console.log("get nonce from wallet node json is " + data);
                    var nonceStr = JSON.parse(data);
                    console.log("nonce from wallet is " + nonceStr.result);
                    var signTx = send.getSignTransaction(privateKey, nonceStr.result, sendInfo.toAddress, sendInfo.sendToBalance, sendInfo.sendFee, sendInfo.sendContent);
                    if( signTx == null ) {
                      requestBack({
                        success:false,
                        error:"sign transaction result is null",
                        errorCode:2003
                      })
                    }
                    console.log("The sign of the transaction is " + signTx);
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

                    var req = https.request(options, function (res) {
                      res.setEncoding('utf-8');
                      var responseString = '';
                      res.on('data', function (data) {
                        responseString += data;
                        console.log("get block number from wallet node success and back data is " + data)
                        var blockNumberStr = JSON.parse(data);
                        var blockNumber = parseInt(blockNumberStr.result,16);
                        console.log("block number from wallet is " + blockNumber);
                        var body = {
                          "jsonrpc":"2.0",
                          "method":"let_sendRawTransaction",
                          "params":[signTx],
                          "id":1
                        }
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
                        var req = https.request(options, function (res) {
                          res.setEncoding('utf-8');
                          var responseString = '';
                          res.on('data', function (data) {
                            responseString += data;
                            console.log("send information wallet back data is= " + data)
                            var sendInformation = JSON.parse(data);
                            if(sendInformation.result != null ) {
                              console.log("send data from wallet parse is " + sendInformation.result);
                              sendRecord.sendRcordData(sendInfo.fromAddress, sendInfo.accountId, sendInfo.toAddress,
                                sendInfo.sendToBalance, sendInfo.sendFee, sendInfo.sendContent, "1", blockNumber, sendInformation.result);
                              requestBack({
                                success:true,
                                succHash:"success",
                              })
                            } else {
                              sendRecord.sendRcordData(sendInfo.fromAddress, sendInfo.accountId, sendInfo.toAddress,
                                sendInfo.sendToBalance, sendInfo.sendFee, sendInfo.sendContent, "2", blockNumber, "transaction fail, there isn't hash in database");
                              requestBack({
                                success:false,
                                error:"fail",
                                errorCode:2004
                              })
                            }
                          });
                          res.on('end', function (res) {
                            console.log("response end");
                          });
                          req.on('error', function (e) {
                            console.log('error occur,error is', e);
                            requestBack({
                              success:false,
                              error:"error occur,error is" + e,
                              errorCode:2005
                            })
                          });
                        });
                        req.write(bodyString);
                        req.end();
                      });
                      res.on('end', function (res) {
                        console.log("response end");
                      });

                      req.on('error', function (e) {
                        console.log('error occur,error is', e);
                        requestBack({
                          success: false,
                          error:'error occur,error is' + e,
                          errorCode:2006
                        })
                      });
                    });
                    req.write(bodyString);
                    req.end();
                  });
                  res.on('end', function (res) {
                    console.log("response end");
                  });
                  req.on('error', function (e) {
                    console.log('error occur,error is', e);
                    requestBack({
                      success:false,
                      error:"error occur,error is" + e,
                      errorCode:2007
                    })
                  });
                });
                req.write(bodyString);
                req.end();
              });
            } else {
              requestBack({
                success:false,
                error:"password is wrong",
                errorCode:2008,
              })
            }
          }
        });
      }
    }
  }
});
export default sendTransaction
