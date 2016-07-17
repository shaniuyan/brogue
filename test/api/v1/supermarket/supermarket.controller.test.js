/**
 * Created by wk on 2016/2/29.
 */
var request = require('superagent');
var should = require('should');

describe('test /api/v1/supermarket/goods.controller.js', function () {
    before(function (done) {
        done();
    });
    afterEach(function () {

    });
    describe('test all goods controller api ', function () {
        /*for (var i = 0; i <= 10000; i++) {
            it.skip("添加商品", function (done) {

                request.post(testrooturl + '/api/v1/supermarket/addgood.json')
                    .send({
                        goodCode: "1001",
                        goodName: "方便面",
                        brand: "小康",
                        model: "",
                        goodBar: "9787550265332",
                        price: 78.00,
                        purchasePrice: 75.00,
                        quantity: 20,
                        wholeUnit: "箱",
                        unit: "袋",
                        lastStorageTime: new Date().getTime()
                    })
                    .end(function (err, res) {
                        should.not.exists(err);
                        console.log(res.status);
                        console.log(res.body);
                        res.body.should.have.property('error_code', 0);
                        done();
                    });

            });
        }*/

        it("获取商品", function (done) {
            request.get(testrooturl + '/api/v1/supermarket/goodlist.json')
                .send({
                    pageIndex:100,
                    pageSize:100
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