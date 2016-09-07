/**
 * 获取查询对象 by王凯
 */
'use strict';
var _ = require('lodash');
var moment = require("moment");
var crypto = require('crypto');


/**
 * 向前补零
 * @param num
 * @param n
 * @returns {*}
 */
var pad = exports.pad = function (num, n) {
    return Array(n > ('' + num).length ? (n - ('' + num).length + 1) : 0).join(0) + num;
}

/**
 * 获取下一个编号
 * @param prefix
 * @param lastWholesaleNum
 * @returns {*}
 */
exports.nextBatchNumber = function(lastWholesaleNum){
    if(!lastWholesaleNum){
        return null;
    }
    var NSnum = lastWholesaleNum.substr(10,5);
    var nextNum = parseInt(NSnum)+1;
    var strformat = lastWholesaleNum.substr(0,10);
    var curNum = pad(nextNum,5);
    return strformat + curNum;
};


exports.parseInsertSqlObj = function(obj,tableName){
    var sqlStr = "insert into "+tableName+"({insertcol}) values ({insertval})";
    var keys = _.keys(obj);
    var values = _.values(obj);

    var cols = [],vals= [],insertInfos = [];;
    _.each(keys,function(key){
        cols.push("??");
        insertInfos.push(key);
    });
    _.each(values,function(value){
        vals.push("?");
        insertInfos.push(value);
    });
    sqlStr = sqlStr.replace("{insertcol}",cols.join(",")).replace("{insertval}",vals.join(","));
    return {
        sqlStr:sqlStr,
        insertInfos:insertInfos
    };
};

exports.parseFindSqlObj = function(obj,tableName){
    obj=obj||{where:{1:1}};
    var findSql = "select * from "+tableName+" where {where}";
    var keys = _.keys(obj.where);
    var wheres = [];
    _.each(keys,function(key){
        wheres.push(key+"='"+obj.where[key]+"'");
    });
    obj.relationship = obj.relationship || "and";
    findSql = findSql.replace("{where}",wheres.join(" "+obj.relationship+" "));
    return findSql;
};

exports.parseFindSqlObjs = function(obj,tableName){
    obj=obj||{where:{1:1}};
    var findSql = "select * from "+tableName+" where {where}";
    var keys = _.keys(obj.where);
    var wheres = [];
    _.each(keys,function(key){
        switch (obj.where[key].relationship){
            case "=":
                wheres.push(key+"='"+obj.where[key].value+"'");
                break;
            case "in":
                wheres.push(key+" in("+obj.where[key].value+")");
                break;
        }

    });
    obj.relationship = obj.relationship || "and";
    findSql = findSql.replace("{where}",wheres.join(" "+obj.relationship+" "));
    return findSql;
};

exports.parseFindFieldSqlObj = function(obj,tableName){
    obj=obj||{where:{1:1}};
    var findSql = "select {field} from "+tableName+" where {where}";
    var keys = _.keys(obj.where);
    var wheres = [];
    _.each(keys,function(key){
        wheres.push(key+"="+obj.where[key]);
    });
    //{sum}
    var fieldss = [];
    var fields = _.keys(obj.fields);
    _.each(fields,function(field){
        fieldss.push(obj.fields[field]+" "+field);
    });
    obj.relationship = obj.relationship || "and";
    findSql = findSql.replace("{where}",wheres.join(" "+obj.relationship+" ")).replace("{field}",fieldss.join(","));
    return findSql;
};

exports.parseUpdateSqlObj = function(obj,tableName){
    var updateSql = "update "+tableName+" set {set} where {where}";

    var setkeys = _.keys(obj.set);
    var sets = [];
    _.each(setkeys,function(key){
        obj.set[key].relationship=obj.set[key].relationship||'=';
        switch (obj.set[key].relationship){
            case "=":
                sets.push(key+"="+obj.set[key].value);
                break;
            case "+":
                sets.push(key+"=ifnull("+key+",0)+"+obj.set[key].value);
                break;
            case "-":
                sets.push(key+"=ifnull("+key+",0)-"+obj.set[key].value);
                break;
            case "*":
                sets.push(key+"=ifnull("+key+",0)*"+obj.set[key].value);
                break;
            case "/":
                sets.push(key+"="+key+"/"+obj.set[key].value);
                break;
        }

    });

    var keys = _.keys(obj.where);
    var wheres = [];
    _.each(keys,function(key){
        wheres.push(key+"="+obj.where[key]);
    });
    obj.relationship = obj.relationship || "and";
    updateSql = updateSql.replace("{set}",sets.join(",")).replace("{where}",wheres.join(" "+obj.relationship+" "));
    return updateSql;

};

exports.parseFindSqlObjLimit = function(obj,tableName,beginRowIndex,pageSize){
    obj=obj||{where:{1:1}};
    var findSql = "select * from "+tableName+" where {where} limit {limit}";
    var keys = _.keys(obj.where);
    var wheres = [];
    _.each(keys,function(key){
        wheres.push(key+"='"+obj.where[key]+"'");
    });
    obj.relationship = obj.relationship || "and";
    findSql = findSql.replace("{where}",wheres.join(" "+obj.relationship+" ")).replace("{limit}",beginRowIndex+","+pageSize);
    return findSql;
};

exports.parseFindSqlObjTotal = function(obj,tableName){
    obj=obj||{where:{1:1}};
    var findSql = "select count(*) total from "+tableName+" where {where}";
    var keys = _.keys(obj.where);
    var wheres = [];
    _.each(keys,function(key){
        wheres.push(key+"="+obj.where[key]);
    });
    obj.relationship = obj.relationship || "and";
    findSql = findSql.replace("{where}",wheres.join(" "+obj.relationship+" "));
    return findSql;
};

exports.deleteFindSqlObj = function(obj,tableName){
    obj=obj||{where:{1:1}};
    var findSql = "delete from "+tableName+" where {where}";
    var keys = _.keys(obj.where);
    var wheres = [];
    _.each(keys,function(key){
        wheres.push(key+"='"+obj.where[key]+"'");
    });
    obj.relationship = obj.relationship || "and";
    findSql = findSql.replace("{where}",wheres.join(" "+obj.relationship+" "));
    return findSql;
};