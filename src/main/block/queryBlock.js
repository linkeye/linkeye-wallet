import queryBlockIpc from '../ipc/ipcQueryBlockMsg'
const {SEVER_IP, SEVER_PORT} = require('../../constants/constants')
const https = require('https');
const dbInit = require('../sqlite/init');

const queryBlock = _queryBlockIpc => ({
  ['block'](event, blockInfo) {
    const requestBack = data => {
      _queryBlockIpc.sendToClient('block-back', data)
    };
    if(blockInfo != null) {
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
      var req = https.request(options, function (res) {
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
          return ;
        });
      });
      req.write(bodyString);
      req.end();
    }
  }
});

export default queryBlock
