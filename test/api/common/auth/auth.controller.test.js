/**
 * Created by wk on 2016/2/29.
 */
var request = require('superagent');
var should = require('should');

describe('test /api/common/auth/auth.controller.js', function () {
    before(function (done) {
        done();
    });
    afterEach(function () {

    });
    describe('test all auth controller api ', function () {
        it.skip("授权管理-添加权限", function (done) {
            request.post(testrooturl + '/api/v1/auth/authorizemodule.json')
                .send({
                    sessionId:'0ef305b7-c365-4e3e-8b6c-8d5003d29cf5',
                    uid:1,
                    moduleId:3
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });

        it.skip("授权管理-删除权限", function (done) {
            request.post(testrooturl + '/api/v1/auth/delauthorizemodule.json')
                .send({
                    sessionId:'0ef305b7-c365-4e3e-8b6c-8d5003d29cf5',
                    cmId:3
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });

        it("授权管理-获取权限", function (done) {
            request.post(testrooturl + '/api/v1/auth/authorizemodulelist.json')
                .send({
                    sessionId:'0ef305b7-c365-4e3e-8b6c-8d5003d29cf5',
                    uid:1,
                    moduleId:1
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