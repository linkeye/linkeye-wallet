const init = require('./init');
const sql = require('./sqlite');

var db = init.checkCreateLinkeyeDb();
var sqlone = "INSERT OR REPLACE  INTO account(" +
  "account_id, account_name, account_passwd, account_address" +
  ") VALUES ('3','3','3','3')";
var err = sql.executeNoQuerySql(sqlone, db);

var sqltwo = "select * from account";
var ret = sql.executeQuerySql(sqltwo, db);

