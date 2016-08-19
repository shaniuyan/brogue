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
        for (var i = 0; i <= 100; i++) {
            it("添加商品", function (done) {

                request.post(testrooturl + '/api/v1/supermarket/addgood.json')
                    .send({
                        goodCode: "1001",
                        goodName: "方便面",
                        brand: "小康",
                        model: "小康系列",
                        goodBar: "9787550265332",
                        purchasePrice: 75.00,
                        price: 78.00,
                        tradePrice: 76,
                        wholenum: 20,
                        scatterednum: 18,
                        wholeUnit: "箱",
                        unit: "袋",
                        conversionunit:30
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
                    pageIndex: 1,
                    pageSize:1
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(JSON.stringify(res.body));
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });

        it.skip("添加服务商", function (done) {

            request.post(testrooturl + '/api/v1/supermarket/addmarketquotient.json')
                .send({
                    companyCode: "1002",
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
                    customerId: 1,
                    customerName: "乡音科技有限公司",
                    wholesaledate: "2016-07-30",
                    customerType: 1
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
                    wholesalid: 1,
                    goodId: 1,
                    wholenum: 10,
                    scatterednum: 0
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });

        it.skip("删除批发单商品信息", function (done) {
            request.post(testrooturl + '/api/v1/supermarket/deletewholesaledetails.json')
                .send({
                    wholesalid: 1,
                    wholesalesdetailId: 2
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
                    wholesalid: 1,
                    paymenttotalamount: 1050.12
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
                .send({})
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });

        it.skip("拆箱", function (done) {

            request.post(testrooturl + '/api/v1/supermarket/unboxing.json')
                .send({
                    goodId: 1,
                    wholenum: 1,
                    wholescatterednum: 300
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });
        it.skip("装箱", function (done) {

            request.post(testrooturl + '/api/v1/supermarket/packing.json')
                .send({
                    goodId: 1,
                    wholenum: 1
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });

        it.skip("更新商品整件数量、零件数量、进价、售价、批发价信息", function (done) {
            request.post(testrooturl + '/api/v1/supermarket/updgoodnum.json')
                .send({
                    goodId: 1,
                    purchasePrice: 52,
                    price: 54.00,
                    tradePrice: 53,
                    wholenum: 1,
                    scatterednum: 1
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    console.log(res.status);
                    console.log(res.body);
                    res.body.should.have.property('error_code', 0);
                    done();
                });

        });

        for (var i = 0; i <= 120; i++) {
            it.skip("添加收货单", function (done) {
                request.post(testrooturl + '/api/v1/supermarket/addpurchasingmanagement.json')
                    .send({
                        totalprice: 0,
                        alreadypaidmoney: 0,
                        purchaseperson: '王凯',
                        purchasephone: '13546710245'
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

        it.skip("获取售货单列表", function (done) {
            request.get(testrooturl + '/api/v1/supermarket/purchasingmanagementlist.json')
                .send({
                    pageIndex: 2,
                    pageSize: 20
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