/*
 * This package used to get account balance througth web3js
 */
/*
 * method:getAccountBalancee-get balance of account througth address
 * params:address-account address
 * return:return account balance
 */
function getAccountBalance( address ){
  if (address == null)
  {
    console.log("The address is null");
  }else{
    var result = web3.eth.getBalance(address)
    console.log("Get the balance of the account in lei is" + result);
    //change unit wei to leter
    var ret =  web3.fromWei(result, "ether");
    console.log("Get the balance of the account in leter is" + ret);
    return ret;
  }
}

exports.getAccountBalance = getAccountBalance;
