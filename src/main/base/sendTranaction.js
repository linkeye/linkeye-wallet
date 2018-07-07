const transaction = require('ethereumjs-tx');
const dbInit = require('../sqlite/init');
var Web3 = require("web3");

if (typeof web3 !== 'undefined')
{
  var web3 = new Web3(web3.currentProvider);
}
else
{
  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

/*
 * method:sendSignTransaction send a transaction to our linkeye wallet node
 * params:a json string
 * return:success return transaction hash
 */
function getSignTransaction(privateKey, nonce, toAddress, sendToBalance, sendFee, sendContent) {
  if(!privateKey || !nonce || !toAddress || !sendToBalance || !sendFee) {
    console.log("one of fromAddress, toAddress, sendToBalance, sendFee is null, please give a valid param");
  } else {
    console.log("param is valid, start sign transaction");
    var numBalance = parseFloat(sendToBalance);
    var balancetoWei = web3.toWei(numBalance, "ether");
    console.log("balancetoWei is " + balancetoWei);
    var oxNumBalance = parseInt(balancetoWei).toString(16);
    console.log("16 oxNumBalance is " + oxNumBalance);
    var gasFee = parseFloat(sendFee);
    var gasFeeToWei = web3.toWei(gasFee, "ether");
    console.log("gas fee to wei is " + gasFeeToWei);
    var gas = gasFeeToWei / 100000000000;
    console.log("param gas is " + gas);
    var oxgasFeeToWei = parseInt(gas).toString(16);
    console.log("16 oxgasFeeToWei is " + oxgasFeeToWei);
    var privateKeyBuffer = privateKey;
    var letAddress = toAddress.substr(3); //23 79 0a 25 6a 41 c3 df a1 92 57 97 ae 47 6e 36 65 15 8f 76
    console.log("let address is " + letAddress);
    var rawTx = {
      nonce:nonce,
      gasPrice: '0x174876e800',
      gas:'0x'+ oxgasFeeToWei,
      to: '0x' + letAddress,
      value:'0x' + oxNumBalance,
      subId:'0x00000000000000000000000000000000',
      data:'0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
    };
    var tx = new transaction(rawTx);
    tx.sign(privateKeyBuffer);
    var serializedTx = tx.serialize();
    if(serializedTx == null) {
      console.log("Serialized transaction fail")
    } else {
      console.log("Serialized transaction success and the result is " + serializedTx.toString('hex'));
      console.log("The sender address is " + tx.getSenderAddress().toString('hex'));
      if (tx.verifySignature()) {
        console.log('Signature Checks out!')
      } else {
        console.log("Signature checks fail")
      }
    }
  }
  return '0x' + serializedTx.toString('hex')
}


exports.getSignTransaction = getSignTransaction;
