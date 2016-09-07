define(["app"], function (BrogueApplication) {
    BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
        Entities.WurchasingManagementDetail = Backbone.Model.extend({
            default: {
                wmDetailId:"",
                wmId:"",
                goodCode: "",
                goodName: "",
                brand: "",
                model: "",
                goodBar: "",
                price: 0.00,
                tradePrice:0.00,
                purchasePrice: 0.00,
                quantity: 0,
                wholeUnit: "",
                unit: "",
                wholenum:"",
                conversionunit:"",
                scatterednum:""
            },
            initialize: function () {

            }
        });
        Entities.WurchasingManagementDetailList = Backbone.Collection.extend({
            model: Entities.WurchasingManagementDetail,
            initialize: function () {
            },
            parse: function (response) {
                return response.response_params.data;
            }
        });
        var API = {
            getWurchasingManagementDetailList: function (opts) {
                var goodList = new Entities.WurchasingManagementDetailList();
                var defer = $.Deferred();
                goodList.url = "/api/v1/supermarket/wholesalemanagementdetaillist.json";
                goodList.fetch({
                    data: {
                        pageIndex: 1,
                        pageSize: 15,
                        wmId:opts.wmId,
                        time:new Date().getTime()
                    },
                    success: function (data) {
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                return promise;
            }
        };
        BrogueApplication.reqres.setHandler("wholemanagementdetail:entities", function (opts) {
            return API.getWurchasingManagementDetailList(opts);
        });
    });
});
