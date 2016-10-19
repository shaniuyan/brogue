/**
 * Created by wk on 2016/9/22.
 */
var paramparse = require("../../common/paramparse");
var moment = require("moment");

exports.folderListAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var pageIndex = 0, beginRowIndex = 0, endRowIndex = 0, pageSize = opts.configs.sysconfig.customer.pageSize;
    if (!isNaN(opts.page.pageIndex)) {
        pageIndex = opts.page.pageIndex;
    }
    if (!isNaN(opts.page.pageSize)) {
        pageSize = parseInt(opts.page.pageSize);
    }
    beginRowIndex = (pageIndex - 1) * pageSize;

    var findCountAsync = bbPromise.resolve();
    if(!opts.page.searchCount){
        var findSqlStr = paramparse.parseFindSqlObjTotal(null,"filemanager");
        findCountAsync = mysqlPool.queryAsync(findSqlStr);
    }

    var objwhere = {
        where:{
            pfileId: opts.filemanger.pfileId
        }
    };

    var findDataStr = paramparse.parseFindSqlObjLimit(objwhere,"filemanager",beginRowIndex,pageSize);
    var findDataAsync = mysqlPool.queryAsync(findDataStr);

    return join(findCountAsync,findDataAsync,function(total,data){
        return {total:total[0].total,data:data}
    }).then(function(result){
        results.error_code = 0;
        results.error_msg = "获取商品列表成功！";
        results.data = result.data;
        results.total = result.total;
        return results;
    });
};


/**
 * 添加文件
 * @param req
 * @param res
 * @param next
 */
exports.addFolderAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "filemanager";
    var findFile = {
        where: {authorId: opts.folder.authorId,folderName:opts.folder.folderName}
    };
    var findSqlStr = paramparse.parseFindSqlObj(findFile,tableName);
    return mysqlPool.queryAsync(findSqlStr).then(function (result) {
        if (result.length) {
            results.error_code = 1001;
            results.error_msg = "你创建的文件已经存在，请修改名称后保存！!";
            return results;
        }

        return getNextFolderBhAsync(opts).then(function(result){
            var insertObj = opts.folder;
            insertObj.filebh = result.data;
            insertObj.createDate = new moment().format("YYYY-MM-DD HH:mm:ss");
            insertObj.updateDate = new moment().format("YYYY-MM-DD HH:mm:ss");
            var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
            return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
                results.error_code = 0;
                results.error_msg = "添加成功";
                results.data = insertObj;
                return results;
            });
        });
    });
}


var getNextFolderBhAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    return mysqlPool.queryAsync("select max(filebh) filebh from brogue_db.filemanager").then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取服务器最新文件编号成功!";
        if (!result[0].filebh) {
            result[0].filebh = 'FM100001';
        } else {
            result[0].filebh = paramparse.nextNumber('FM1',result[0].filebh);
        }
        results.data = result[0].filebh;
        return results;
    }).catch(function (e) {
        results.error_code = 1001;
        results.error_msg = "获取服务器最新文件编号失败，请联系平台管理员!";
        return results;
    });
};