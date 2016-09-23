define(["app"], function (BrogueApplication) {
    BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
        Entities.Customer = Backbone.Model.extend({
            default: {
                name: "",
                sex: "0",
                nickname: "",
                accountNumber: "",
                phone: "",
                telephone: "",
                idNumber: "",
                placeOfOrigin: "",
                presentAddress: "",
                password: "",
                token: ""
            },
            initialize: function () {

            }
        });
        Entities.CustomerList = Backbone.Collection.extend({
            model: Entities.Customer,
            initialize: function () {
            },
            parse: function (response) {
                return response.response_params.data;
            }
        });
        var API = {
            getCustomerList: function () {
                var goodList = new Entities.CustomerList();
                var defer = $.Deferred();
                goodList.url = "/api/v1/manageuser/goodcustomer.json";
                goodList.fetch({
                    data: {
                        pageIndex: 1,
                        pageSize: 15,
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
        BrogueApplication.reqres.setHandler("customer:entities", function () {
            return API.getCustomerList();
        });
    });
});
