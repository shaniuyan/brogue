/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "apps/back_shop/mainpage/filemanager/layout/layout.view",
    "apps/back_shop/mainpage/filemanager/list/table.view",
    "uploadView",
    "apps/back_shop/entity/filemanager.entities"], function (BrogueApplication, LayoutView, TableView, UploadView) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.FileManager", function (NavController, BrogueApplication, Backbone, Marionette, $, _) {
        NavController.Controller = {
            showFileManager: function (Region, xobject) {
                var that = this;
                that.xobject = new Marionette.Object();
                var layoutView = new LayoutView.Layout({xevent: that.xobject});
                Region.show(layoutView);
                var fetchFileManager = BrogueApplication.request("filemanager:entities");
                $.when(fetchFileManager).done(function (filemanagers) {
                    var table = new TableView.Table({
                        collection: filemanagers,
                        xevent: that.xobject,
                        childViewOptions: {xevent: that.xobject}
                    });
                    layoutView.fileRegion.show(table);
                });


                that.xobject.on("filemanager:look", function (model) {
                    var param = {
                        pfileId:model.get("fileId")
                    };
                    that.showFileList(that,layoutView,param);
                });

            },
            showFileList:function(that,layoutView,param){
                var fetchFileManager = BrogueApplication.request("filemanager:entities",param);
                $.when(fetchFileManager).done(function (filemanagers) {
                    var table = new TableView.Table({
                        collection: filemanagers,
                        xevent: that.xobject,
                        childViewOptions: {xevent: that.xobject}
                    });
                    layoutView.fileRegion.show(table);
                });
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.FileManager.Controller;
});
