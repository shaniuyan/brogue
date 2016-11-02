define(["app", "json!apps/back_shop/data/moduls.json"], function (BrogueApplication, moduls) {
    BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
        Entities.Modular = Backbone.Model.extend({
            default:{
                modulePid:"",
                moduleMC:"",
                moduleName:"",
                shorthand:"",
                displayCharacter:"",
                displayPicture:"",
                whetherToEnable:"",
                linkType:"",
                linkPath:"",
                linkPath_android:"",
                linkPath_ios:"",
                createTime:"",
                createTimeStamp :"",
                byUserId:"",
                byUser:"",
                delTag:0
            },
            initialize: function () {
                var childModuls = this.get("childModuls");
                if (childModuls) {
                    this.childModuls = new Entities.ModularList(childModuls);
                    this.unset("childModuls");
                }
            }
        });
        Entities.ModularList = Backbone.Collection.extend({
            model: Entities.Modular,
            initialize: function () {
            },
            parse: function (response) {
                return response.response_params.data;
            }
        });
        var modularList = function () {
            var modularList = new Entities.ModularList();
            var defer = $.Deferred();
            modularList.url = "/api/v1/auth/authorizemodulelist.json";
            modularList.fetch({
                data: {
                    pageIndex: 1,
                    pageSize: 15,
                    uid:1,
                    type:"group"
                },
                success: function (data) {
                    defer.resolve(data);
                }
            });
            var promise = defer.promise();
            return promise;
        };
        var API = {
            getModularList: function () {
                return modularList();
            }
        };
        BrogueApplication.reqres.setHandler("back_modular:entities", function () {
            return API.getModularList();
        });
    });
});
