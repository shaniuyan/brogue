/**
 * Created by wk on 2016/3/10.
 * @description 所有区域信息将存储在一张表中
 * 1、根据区域级别省、市、区/县、乡（镇）、村五级分类查询
 * 2、根据父级区域获取下级区域
 * 3、详细到每个地区区域码
 *
 * @fields
 * province, city, county, township, village, residentsGroup,区域名称
 * provinceCode, cityCode, countyCode, townshipCode, villageCode, residentsGroupCode,区域编码（国标）
 * provinceCodeAs, cityCodeAs, countyCodeAs, townshipCodeAs, villageCodeAs, residentsGroupCodeAs,（系统）
 * description,zipCode,
 * //responsiblePersonId,responsiblePersonName 责任人
 *
 * ==>居民信息表中需要冗余provinceCode, cityCode, countyCode, townshipCode, villageCode, residentsGroupCode这些字段
 *    1、居民信息批量管理
 *    2、通知公告可以准确分单位发布
 *    3、同时可以方便平台限制信息发布
 */
var _ = require("lodash");

exports.createCountry = function(req,res,next){
    var body = {};
    //获取传入的参数
    var param = _.extend(req.body,req.query);
    var opts = {};
};

exports.updateCountry = function(req,res,next){

};

exports.deleteCountry = function(req,res,next){

};

exports.queryCountry = function(req,res,next){

};

exports.uploadCountryImg = function(req,res,next){

};

exports.deleteCountryImg = function(req,res,next){

};