/**
 * Created by wk on 2016/2/29.
 */
var request = require('superagent');
var should = require('should');

describe('test /api/v1/module/module.controller.js', function () {
    before(function (done) {
        done();
    });
    afterEach(function () {

    });
    describe('test all module controller api ', function () {
        it.skip("创建模块", function (done) {
            request.post(testrooturl + '/api/v1/module/addmodule.json')
                .send({
                    sessionId:'0ef305b7-c365-4e3e-8b6c-8d5003d29cf5',
                    //modulePid:1,
                    moduleName:"系统管理",
                    shorthand:"系统管理"
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });
    });
});