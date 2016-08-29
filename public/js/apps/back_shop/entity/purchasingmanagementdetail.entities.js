define(["app"], function (BrogueApplication) {
    BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
        Entities.PurchasingManagementDetail = Backbone.Model.extend({
            default: {
                pmDetailId:"",
                pmId:"",
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
        Entities.PurchasingManagementDetailList = Backbone.Collection.extend({
            model: Entities.PurchasingManagementDetail,
            initialize: function () {
            },
            parse: function (response) {
                return response.response_params.data;
            }
        });
        var API = {
            getPurchasingManagementDetailList: function (opts) {
                var goodList = new Entities.PurchasingManagementDetailList();
                var defer = $.Deferred();
                goodList.url = "/api/v1/supermarket/purchasingmanagementdetaillist.json";
                goodList.fetch({
                    data: {
                        pageIndex: 1,
                        pageSize: 15,
                        pmId:opts.pmId
                    },
                    success: function (data) {
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                return promise;
            }
        };
        BrogueApplication.reqres.setHandler("purchasingmanagementdetail:entities", function (opts) {
            return API.getPurchasingManagementDetailList(opts);
        });
    });
});
