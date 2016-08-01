/**
 * Created by wk on 2016/7/29.
 */

var moment = require("moment");
var paramparse = require("../../common/paramparse")
/**
 * 添加批发单信息
 */
exports.addWholesaleAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var insertObj = [
        "wholesalenum",
        "customerId",
        "customerName",
        "customerType",
        "totalamount",
        "paymenttotalamount",
        "paymentstatus",
        "wholesaledate",
        "createtime",
        opts.wholesale.wholesalenum,
        opts.wholesale.customerId,
        opts.wholesale.customerName,
        opts.wholesale.customerType,
        opts.wholesale.totalamount,
        opts.wholesale.paymenttotalamount,
        opts.wholesale.paymentstatus,
        opts.wholesale.wholesaledate,
        opts.wholesale.createtime
    ];

    var findCustomerAsync = bbPromise.resolve();

    if(opts.wholesale.customerType == 1){
        var findWhereCustomer = [
            "companyId",
            opts.wholesale.customerId,
            "companyName",
            opts.wholesale.customerName
        ];
        findCustomerAsync = mysqlPool.queryAsync("select * from marketquotient where ??=? and ??=?",findWhereCustomer);
    }else{
        findCustomerAsync = mysqlPool.queryAsync("select * from marketcurtomer where ??=? and ??=?",findWhereCustomer);
    }

    return findCustomerAsync.then(function(result){
        if(!result.length){
            results.error_code = 1001;
            results.error_msg = "所选择客户不存在，请先录入该客户信息！";
            return results;
        }
        return getNexWholesaleNumAsync(opts).then(function(result){
            insertObj[9] = result.data;
            return mysqlPool.queryAsync("insert into wholesales(??,??,??,??,??,??,??,??,??) values (?,?,?,?,?,?,?,?,?)", insertObj).then(function (result) {
                if(result.affectedRows == 1){
                    opts.wholesale.wholesalesId = result.insertId;
                }
                results.error_code = 0;
                results.error_msg = "添加批发单成功";
                results.data = opts.wholesale;
                return results;
            }).catch(function(e){
                results.error_code = 1001;
                results.error_msg = "添加批发单失败，请联系技术人员";
                return results;
            });
        });

    });

};



/**
 *
 * @param opts
 */
exports.addPaymentAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    /**
     opts.wholesale.wholesalid = param.wholesalid;
     opts.wholesale.paymentamount = param.paymentamount;
     */
    var findWhere = [
        "wholesalid",
        opts.wholesale.wholesalid
    ];
    return mysqlPool.queryAsync("select ")
};


var getNexWholesaleNumAsync = exports.getNexWholesaleNumAsync = function(opts){
    //select max(wholesalenum) lastwholesalenum from brogue_db.wholesales;
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    return mysqlPool.queryAsync("select max(wholesalenum) lastwholesalenum from brogue_db.wholesales").then(function(result){
        results.error_code = 0;
        results.error_msg = "获取服务器最新批发编号成功!";
        if(!result[0].lastwholesalenum) {
            result[0].lastwholesalenum = 'WS' + new moment().format("YYYYMMDD") + "00001"
        }else{
            result[0].lastwholesalenum = paramparse.nextBatchNumber(result[0].lastwholesalenum);
        }
        results.data = result[0].lastwholesalenum;
        return results;
    }).catch(function(e){
        results.error_code = 1001;
        results.error_msg = "获取最新批发编号失败，请联系平台管理员!";
        return results;
    });
};