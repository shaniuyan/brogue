define(["app"], function (BrogueApplication) {
    BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
        Entities.WurchasingManagement = Backbone.Model.extend({
            default: {
                wmId: 0,
                whcode: "",
                totalprice: 0,
                alreadypaidmoney: 0,
                purchaserole:"",
                purchaseperson: "",
                purchasephone: "",
                paystatus: 0,
                createTime: "",
                clearTime: ""
            },
            initialize: function () {

            }
        });
        Entities.WurchasingManagementList = Backbone.Collection.extend({
            model: Entities.WurchasingManagement,
            initialize: function () {
            },
            parse: function (response) {
                return response.response_params.data;
            }
        });
        var API = {
            getWurchasingManagementList: function (param) {
                param = param || {};
                var goodList = new Entities.WurchasingManagementList();
                var defer = $.Deferred();
                goodList.url = "/api/v1/supermarket/wholesalemanagementlist.json";
                goodList.fetch({
                    data: {
                        pageIndex: 1,
                        pageSize: 15,
                        time:new Date().getTime(),
                        paystatus:param.paystatus
                    },
                    success: function (data) {
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                return promise;
            }
        };
        BrogueApplication.reqres.setHandler("wholesalemanagement:entities", function (param) {
            return API.getWurchasingManagementList(param);
        });
    });
});
