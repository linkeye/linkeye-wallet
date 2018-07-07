/*
 * This Package used to execute sql operation
 */

// error code
const execSqlErr = 'sqlerrone'

// init database handle

/*
 * Method:This function is used to execute sql sentence
 * params: sql-sql sentence
 * params: db-database handle
 * return: fail to return error code
 */
function executeNoQuerySql(sql, db) {
  if (!sql) {
    console.log("sql sentence is null")
    return execSqlErr;
  }else {
    db.run(sql)
  }
}

/*
 * Method:This function is used to execute sql sentence
 * params: sql-sql sentence
 * params: db-database handle
 * return: success to return result set; fail to print error
 */
function executeQuerySql(sql, db) {
  if (!sql) {
    console.log("sql sentence is null")
  }else {
    db.all(sql, function(err, res) {
      if(!err) {
        var ret = JSON.stringify(res)
        console.log(ret)
      } else {
        console.log(err);
      }
    });
  }
}

export default executeNoQuerySql
//export default executeQuerySql


