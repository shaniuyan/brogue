/**
 * Created by wangkai on 2015/5/7.
 */
var bbPromise = require("bluebird");
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'brogue_db'
});

var mysqlPool = bbPromise.promisifyAll(pool);

var mysql = {};
mysql.mysqlPool = mysqlPool;
mysql.bbpromise = bbPromise;

module.exports = mysql;