// var Web3 = require("web3");
//
// if (typeof web3 !== 'undefined')
// {
//   web3 = new Web3(web3.currentProvider);
// }
// else
// {
//   web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//   console.log(web3.version.api)
// }

function getTransactionNonce(address){
  if (address == null)
  {
    console.log("address is null");
  }else{
    var nonce = "";//web3.eth.getTransactionCount(address)
    console.log("the account address " + address + "nonce is " + nonce);
  }
  return nonce;
}

exports.getTransactionNonce = getTransactionNonce;
