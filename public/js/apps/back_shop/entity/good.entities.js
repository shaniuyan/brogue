define(["app"], function (BrogueApplication) {
    BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
        Entities.Good = Backbone.Model.extend({
            default: {
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
                wholenum:1,
                conversionunit:0,
                scatterednum:1
            },
            initialize: function () {

            }
        });
        Entities.GoodList = Backbone.Collection.extend({
            model: Entities.Good,
            initialize: function () {
            },
            parse: function (response) {
                return response.response_params.data;
            }
        });
        var API = {
            getGoodList: function () {
                var goodList = new Entities.GoodList();
                var defer = $.Deferred();
                goodList.url = "/api/v1/supermarket/goodlist.json";
                goodList.fetch({
                    data: {
                        pageIndex: 1,
                        pageSize: 15
                    },
                    success: function (data) {
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                return promise;
            }
        };
        BrogueApplication.reqres.setHandler("good:entities", function () {
            return API.getGoodList();
        });
    });
});
