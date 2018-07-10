import recordInfoIpc from '../ipc/ipcRecordMsg'
const dbInit  = require('../sqlite/init');
var schedule = require('node-schedule');

// var rule = new schedule.RecurrenceRule();
// var times = [];
// for(var i = 1; i < 60; i += 4){
//   times.push(i);
// }
// rule.second = times;

const recordInfo = _recordInfoIpc => ({
  ['record'](event, accountId) {
    // var j = schedule.scheduleJob(rule, function() {
      const requestBack = data => {
        _recordInfoIpc.sendToClient('record-back', data)
    };
    var db = dbInit.checkCreateLinkeyeDb();
    if(!db){
      console.log("db handle is null");
      requestBack({
        success: false,
        error:"db handle is null",
        errorCode:909
      })
    } else {
      console.log("get accountId from front success, accountId is " + accountId);
      var sql = "select * from record where account_id = " + "\'" + accountId + "\' order by strftime('%s', send_time) asc";
      db.all(sql, function(err, res) {
        if(!err) {
          var result= JSON.stringify(res);
          console.log("Get record from database is " + result);
          requestBack({
            success: true,
            recordInfo:result
          })
        } else {
          console.log("error occur， error is" + err);
          requestBack({
            success: false,
            error:err,
            errorCode:910
          })
        }
      });
    }
   // })
  }
});

export default recordInfo
