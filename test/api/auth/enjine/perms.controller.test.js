/**
 * Created by wk on 2016/2/29.
 */
var request = require('superagent');
var should = require('should');

describe('test /api/auth/apps/auth/enjine/perms.controller.js', function () {
    before(function (done) {
        done();
    });
    afterEach(function () {

    });
    describe('test all auth controller api ', function () {
        it.skip("添加权限", function (done) {
            request.post(testrooturl + '/api/auth/perm/addperm.json')
                .send({
                    permXh: 99999,
                    permName: "测试删除",
                    permUrl: "",
                    level: 0,
                    parentPermXh: 0,
                    isParent: true,
                    orderNo: 99999
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });
        });
        it.skip("修改权限", function (done) {
            request.post(testrooturl + '/api/auth/perm/updperm.json')
                .send({
                    permXh: 1,
                    permName: "医生平台",
                    permUrl: "",
                    level: 0,
                    parentPermXh: 0,
                    isParent: true,
                    orderNo: 1
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });
        });
        it.skip("删除权限", function (done) {
            request.post(testrooturl + '/api/auth/perm/delperm.json')
                .send({
                    permXh: 4
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });
        });
        it.skip("用户角色权限分配", function (done) {
            request.post(testrooturl + '/api/auth/perm/userroleassignment.json')
                .send({
                    roleXh: 1,
                    userId: 1,
                    assignmentType: 0
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });
        });
        it.skip("用户权限分配", function (done) {
            request.post(testrooturl + '/api/auth/perm/userpermsassignment.json')
                .send({
                    permXh: 2,
                    userId: 1,
                    assignmentType:0
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });
        });
        it.skip("角色权限分配", function (done) {
            request.post(testrooturl + '/api/auth/perm/rolepermsassignment.json')
                .send({
                    roleXh: 1,
                    permXh:1,
                    assignmentType: 0
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