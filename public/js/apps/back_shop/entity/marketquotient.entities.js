define(["app", "json!apps/back_shop/data/marketquotient.json"], function (BrogueApplication, moduls) {
    BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
        Entities.MarketQuotient = Backbone.Model.extend({
            default: {
                companyCode: "",
                companyName: "",
                linkMan: "",
                tel: "",
                phone: "",
                currentaccount: "",
                buildtime: "",
                isimportant: ""
            },
            initialize: function () {

            }
        });
        Entities.MarketQuotientList = Backbone.Collection.extend({
            model: Entities.MarketQuotient,
            initialize: function () {
            },
            parse: function (response) {
                return response.response_params;
            }
        });
        var API = {
            getMarketQuotientList: function () {
                var marketQuotientList = new Entities.MarketQuotientList();
                var defer = $.Deferred();
                marketQuotientList.url = "/api/v1/supermarket/marketquotient.json";
                marketQuotientList.fetch({
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
        BrogueApplication.reqres.setHandler("marketquotient:entities", function () {
            return API.getMarketQuotientList();
        });
    });
});
