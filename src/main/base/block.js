/*
 * This package is used to get block number from our linkeye wallet node
 */
/*
 * Method:getBlockNumber get block information from linkeye wallet node
 * params:none
 * return:success return block information
 */
function getBlockNumbet() {
  var syndata = web3.eth.eth_syncing()
  if(syndata == null) {
    console.log("Get syndate fail")
  } else {
    console.log("Get syndate success and the syndate is " + syndata)
  }
  return syndata;
}

exports.getBlockNumber = getBlockNumber;
