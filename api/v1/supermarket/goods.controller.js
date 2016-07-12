/**
 * Created by wk on 2016/7/12.
 */
var _ = require("lodash");

exports.addGood = function(req,res,next){
   /* _.each(req.configs["good"]["addGood"],function(validator){

    });*/
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {customer:{}};
    //var loginCustomer = customerModel.userTestListAsync(opts);
    body.error_code = 0;
    body.error_msg = "添加失败";
    res.status(200).json(body);
};