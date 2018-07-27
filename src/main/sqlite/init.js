// import node modules package
const {DATABASE_PATH} = require('../../constants/constants')

const fs = require('fs');
const path = require('path')
const sqlite3 = require("sqlite3").verbose();

//import own package
const propath = require('../dir/handle');

// database file
const file = "linkeye.db";

//define error information
const createAccountTableErr = 'errone';
const createSendTableErr = 'errtwo';
const createLoginTableErr = 'errthree';

//define success information
const createAccountTableSucc = 'succone';
const createSendTableSucc = 'succtwo';
const createLoginTableSucc = 'succthree';

var initDataBase={};

/*
 * method:This funbction used to get the linkeye.db directory
 * params:no
 * return:linkeye.db directory
 */
function getDbFilePath(flag) {
  var dir =  propath.handlePath();
  var dbDir = path.resolve(dir, '../../../');
  var linkFileDir = dbDir + flag + file;
  return linkFileDir;
}

/*
 * method:This funbction used to check the linkeye.db file is exist or not
 * params:no
 * return:no
 */
initDataBase.checkCreateLinkeyeDb = function (){
  var db;
  if (!fs.existsSync(DATABASE_PATH)) {
    fs.mkdirSync(DATABASE_PATH);
    console.log("create database directry success and database directory is " + DATABASE_PATH);
  }
  var linkDirFile = DATABASE_PATH + file;
  var exists = fs.existsSync(linkDirFile);
  if(!exists) {
    db = new sqlite3.Database(linkDirFile);
    console.log('create linkeye.db success' + linkDirFile);
  }else {
    db = new sqlite3.Database(linkDirFile);
    console.log('linkeye.db is already exist' + linkDirFile);
  }
  return db;
}

/*
* method:This funbction used to create login table
* params:tableName
* params:db
* return:
*/
initDataBase.createLoginTable = function(tableName, db){
  if (!tableName || !db ){
    console.log("table name or db is null")
    return createLoginTableErr;
  }else {
    db.run("CREATE TABLE IF NOT EXISTS  "+ tableName + "  (" +
      "login_id       TEXT," +
      "login_passwd   TEXT," +
      "is_login       TEXT" +
      ")" );
    console.log("create login table success");
  }
  return createLoginTableSucc;
}

/*
 * method:This funbction used to create account table
 * params:tableName
 * params:db
 * return:
 */
initDataBase.createAccountTable = function(tableName, db) {
  if (!tableName || !db ){
    console.log("table name or db is null")
    return createAccountTableErr;
  }else {
    db.run("CREATE TABLE IF NOT EXISTS  "+ tableName + "  (" +
      "account_id                     TEXT PRIMARY KEY NOT NULL," +
      "account_name                   TEXT ," +
      "account_passwd                 TEXT ," +
      "account_address                TEXT ," +
      "account_keystore               NTEXT," +
      "account_ciphertext_private_key NTEXT" +
      ") ");
    console.log("create account table success");
  }
  return createAccountTableSucc;
}

/*
 * method:This funbction used to create send table
 * params:tableName
 * params:db
 * return:
 */
initDataBase.createSendTable = function(tableName, db) {
  if (!tableName || !db){
    console.log("table name or db  is null");
    return createSendTableErr;
  }else {
    db.run("CREATE TABLE IF NOT EXISTS  "+ tableName + "  (" +
      "send_id           TEXT PRIMARY KEY NOT NULL," +
      "account_id        TEXT ," +
      "send_time         TEXT ," +
      "account_addr_from TEXT ," +
      "account_addr_to   TEXT ," +
      "send_balance      TEXT ," +
      "service_charge    TEXT ," +
      "comment           TEXT ," +
      "send_status       TEXT ," +
      "block_number      TEXT ," +
      "trans_hash        TEXT " +
      ") ");
    console.log("create send table success");
  }
  return createSendTableSucc;
}

module.exports = initDataBase;
