import affirmTransActionIpc from '../ipc/ipcAffirmTransaction'
const http=require('http');

const affirmTransAction = _affirmTransActionIpc => ({
  ['affirm'](event, affirmInfo) {
    const requestBack = data => {
      _affirmTransActionIpc.sendToClient('affirm-back', data)
    };
    if(affirmInfo == null) {
      console.log("get affirmInfo from front fail and affirmInfo is null")
    } else {
      console.log("get affirmInfo from front success and affirmInfo is " + affirmInfo)
      var body = {
        "jsonrpc": "2.0",
        "method": "eth_blockNumber",
        "params":[],
        "id":83
      };

      var bodyString = JSON.stringify(body);
      var headers = {
        'Content-Type':'application/json',
        'Content-Length':bodyString.length
      };

      var options = {
        host:'localhost',
        port:8545,
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
          var blockNumber = parseInt(blockNumberStr.result,16);
          console.log("block number from wallet is " + blockNumber);
          requestBack({
            success: true,
            blockNumber:blockNumber
          })
        });
        res.on('end', function (res) {
          console.log("response end");
        });

        req.on('error', function (e) {
          console.log('error occur,error is', e);
          requestBack({
            success: false,
            error:'error occur,error is' + e
          })
        });
      });
      req.write(bodyString);
      req.end();
    }
  }
});

export default affirmTransAction
