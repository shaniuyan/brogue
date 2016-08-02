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
       for (var i = 0; i <= 1; i++) {
            it.skip("添加商品", function (done) {

                request.post(testrooturl + '/api/v1/supermarket/addgood.json')
                    .send({
                        goodCode: "1001",
                        goodName: "方便面",
                        brand: "小康",
                        model: "",
                        goodBar: "9787550265332",
                        purchasePrice: 75.00,
                        price: 78.00,
                        tradePrice:76,
                        wholenum: 20,
                        scatterednum: 18,
                        wholeUnit: "箱",
                        unit: "袋"
                    })
                    .end(function (err, res) {
                        should.not.exists(err);
                        console.log(res.status);
                        console.log(res.body);
                        res.body.should.have.property('error_code', 0);
                        done();
                    });

            });
        }

        it.skip("获取商品", function (done) {
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

        it.skip("添加服务商", function (done) {

            request.post(testrooturl + '/api/v1/supermarket/addmarketquotient.json')
                .send({
                    companyCode:"1002",
                    companyName: "布谷科技有限公司",
                    linkMan: "王凯",
                    tel: "0355-8285809",
                    phone: "13546710244",
                    currentaccount: "电脑、平板",
                    buildtime: new Date().getTime(),
                    isimportant: 1
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });


        it.skip("添加批发单", function (done) {

            request.post(testrooturl + '/api/v1/supermarket/addwholesale.json')
                .send({
                    customerId:1,
                    customerName: "乡音科技有限公司",
                    wholesaledate: "2016-07-30",
                    customerType:1
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });

        it.skip("添加批发单商品信息", function (done) {
            request.post(testrooturl + '/api/v1/supermarket/addwholesaledetails.json')
                .send({
                    wholesalid:1,
                    goodId: 1,
                    wholenum:10,
                    scatterednum:0
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });

        it.skip("修改批发单应支付金额", function (done) {

            request.post(testrooturl + '/api/v1/supermarket/updpaymenttotalamount.json')
                .send({
                    wholesalid:1,
                    paymenttotalamount:1050.12
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });


        it.skip("获取最新批发单号", function (done) {

            request.get(testrooturl + '/api/v1/supermarket/lastwholesalenum.json')
                .send({
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