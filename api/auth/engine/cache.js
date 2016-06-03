/**
 * Created by wk on 2016/2/26.
 */

/**
 * 初始化系统的权限信息，并且缓存以下数据
 * 1、api列表数据
 * 2、角色列表、角色具有的权限列表
 * 3、医院、部门列表
 */
exports.initAuthData = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var bbPromise = req.dbs.bbpromise;
    var join = bbPromise.join;
    var opts = {
        dbs: req.dbs,
        configs: req.configs
    };
    var authDb = opts.dbs[req.configs.dbName];
    //获取系统api列表信息
    var permAsync = authDb.collection("perms").find().toArrayAsync();
    //获取系统角色列表信息
    var roleAsync = authDb.collection("roles").find().toArrayAsync();
    return join(permAsync,roleAsync,function(rperm,rrole){
        if(true){}
    }).then(function(result){
        return result;
    });
};