import getAccountBalanceIpc from '../ipc/ipcBalanceMsg'
const {SEVER_IP, SEVER_PORT} = require('../../constants/constants')

const https = require('https');
var Web3 = require("web3");

if (typeof web3 !== 'undefined')
{
  var web3 = new Web3(web3.currentProvider);
}
else
{
  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const getAccountBalance = _getAccountBalanceIpc => ({
  ['balance'](event, accountAddress) {
    const requestBack = data => {
      _getAccountBalanceIpc.sendToClient('balance-back', data)
    };

    if(!accountAddress)
    {
      console.log("get account address from front succusss accountAddress is null")
      requestBack({
        success: false,
        error: "error occur,error is" + e,
        errorCode:1000
      })
    }else {
      console.log("get account address from front succusss accountAddress is " + accountAddress)
      var body = {
        "jsonrpc": "2.0",
        "method": "let_getBalance",
        "params": ["0x" + accountAddress, "latest"],
        "id":83
      };
      var bodyString = JSON.stringify(body);
      var headers = {
        'Content-Type': 'application/json',
        'Content-Length': bodyString.length
      };
      //https://wallet.linkeye.com
      var options = {
        host: SEVER_IP,
        port: SEVER_PORT,
        path: '',
        method: 'POST',
        headers: headers
      };
      var req = https.request(options, function (res) {
        res.setEncoding('utf-8');
        var responseString = '';
        res.on('data', function (data) {
          responseString += data;
          console.log("get balance from wallet node success and back data is " + data);
          var balance = JSON.parse(data);
          var tenBalance = parseInt(balance.result,16);
          console.log("balance from wallet is " + tenBalance);
          requestBack({
            success: true,
            accountBalance:{"address":accountAddress, "balance":web3.fromWei(tenBalance, "ether")}
          })
        });
        res.on('end', function (res) {
          console.log("response end");
        });
        req.on('error', function (e) {
          console.log('error occur,error is', e);
          requestBack({
            success: false,
            error: "error occur,error is" + e,
            errorCode:1001
          })
        });
      });
      req.write(bodyString);
      req.end();
    }
  }
});

export default getAccountBalance
