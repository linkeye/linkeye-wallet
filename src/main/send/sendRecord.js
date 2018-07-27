const {MICSERVER_IP, MICSERVER_PORT} = require('../../constants/constants')

var UUID = require('uuid');
const dbInit = require('../sqlite/init');
const https = require('http');

function sendRcordData(fromAddress, accountId, toAddress, sendToBalance, sendFee, sendContent, status, blockNumber, transHash) {
  if(!fromAddress || !accountId || !toAddress || !sendToBalance || !sendFee || !status == null) {
    console.log("one of these params is null");
  } else {
    var uuidId = UUID.v1();
    if (uuidId == null) {
      console.log("generate uuid fail");
    } else {
      console.log("generate uuid success and uuid is " + uuidId);
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
      console.log("generate time is " + dateTime);
      var db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null");
      } else {
        var err = dbInit.createSendTable("record", db);
        if(err == 'errone'){
          console.log('create account table fail');
        }else {
          var insert = db.prepare("INSERT INTO record(send_id, account_id, send_time, account_addr_from," +
            "account_addr_to, send_balance, service_charge, comment, send_status, block_number, trans_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
          insert.run(uuidId, accountId, dateTime, fromAddress, toAddress, sendToBalance, sendFee, sendContent, status, blockNumber, transHash);
          insert.finalize();
          db.close();
          var body = {
            "sendTime":dateTime,
            "sendBalance":sendToBalance,
            "fromAddress":fromAddress,
            "toAddress":toAddress,
            "sendFee":sendFee,
            "status":status,
            "delInfo":0,
            "sendState":0,
            "sendHash":transHash,
            "sendComment":sendContent
          };
          var bodyString = JSON.stringify(body);
          var headers = {
            'Content-Type':'application/json',
            'Content-Length':bodyString.length
          };

          var options = {
            host: MICSERVER_IP,
            port: MICSERVER_PORT,
            path: '/sendrecordinfo/addsendrecordinfo',
            method: 'POST',
            headers: headers
          };
          var req = https.request(options, function (res) {
            res.setEncoding('utf-8');
            var responseString = '';
            res.on('data', function (data) {
              responseString += data;
              console.log("get data from micServer success and back data is " + data);
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
        }
      }
    }
  }
}

exports.sendRcordData = sendRcordData;
