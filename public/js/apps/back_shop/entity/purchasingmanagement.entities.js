define(["app"], function (BrogueApplication) {
    BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
        Entities.PurchasingManagement = Backbone.Model.extend({
            default: {
                pmId: 0,
                phcode: "",
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
        Entities.PurchasingManagementList = Backbone.Collection.extend({
            model: Entities.PurchasingManagement,
            initialize: function () {
            },
            parse: function (response) {
                return response.response_params.data;
            }
        });
        var API = {
            getPurchasingManagementList: function (param) {
                param = param || {};
                var goodList = new Entities.PurchasingManagementList();
                var defer = $.Deferred();
                goodList.url = "/api/v1/supermarket/purchasingmanagementlist.json";
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
        BrogueApplication.reqres.setHandler("purchasingmanagement:entities", function (param) {
            return API.getPurchasingManagementList(param);
        });
    });
});
