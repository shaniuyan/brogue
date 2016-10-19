define(["app"], function (BrogueApplication) {
    BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
        Entities.FileManager = Backbone.Model.extend({
            default: {
                folderName: "",
                fileType: "",
                title: "",
                fileSize: 0,
                createDate: "",
                updateDate: "",
                authorId: 0,
                authorName: 0,
                path: "",
                remark: "",
                pfileId:0
            },
            initialize: function () {

            }
        });
        Entities.FileManagerList = Backbone.Collection.extend({
            model: Entities.FileManager,
            initialize: function () {
            },
            parse: function (response) {
                return response.response_params.data;
            }
        });
        var API = {
            getFileManagerList: function (param) {
                var goodList = new Entities.FileManagerList();
                var defer = $.Deferred();
                goodList.url = "/api/v1/filemanager/folderlist.json";
                goodList.fetch({
                    data: {
                        pageIndex: 1,
                        pageSize: 15,
                        time:new Date().getTime(),
                        pfileId:param.pfileId||0
                    },
                    success: function (data) {
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                return promise;
            }
        };
        BrogueApplication.reqres.setHandler("filemanager:entities", function (param) {
            param = param || {};
            return API.getFileManagerList(param);
        });
    });
});
