/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "apps/back_shop/mainpage/rightregion/good/layout/layout.view",
    "apps/back_shop/mainpage/rightregion/good/list/list.view",
    "apps/back_shop/entity/good.entities"], function (BrogueApplication, LayoutView, ListView) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.GoodList", function (GoodListController, BrogueApplication, Backbone, Marionette, $, _) {
        GoodListController.Controller = {
            showGoodList: function (Region) {
                var that = this;
                that.xobject = new Marionette.Object();

                var layoutView = new LayoutView.Layout({xevent:that.xobject});
                Region.show(layoutView);
                var fetchGoods = BrogueApplication.request("good:entities");
                $.when(fetchGoods).done(function (goods) {
                    that.goodTables = new ListView.Table({collection:goods});
                    layoutView.goodListRegion.show(that.goodTables);
                });

                that.xobject.on("goodadd:form",function(){
                    that.goodModel = new BrogueApplication.Entities.Good;
                    require(["apps/back_shop/mainpage/rightregion/good/mainform/mainform.view"],function(MainFormView){
                        that.mainFormView = new MainFormView.Form({model: that.goodModel, xevent: that.xobject});
                        BrogueApplication.dialogFormRegion.show(that.mainFormView, {
                            title: "出售信息",
                            height: 430,
                            width: 400
                        });
                    });
                });

                that.xobject.on("good:add",function(opt){
                    that.goodModel.url = "/api/v1/supermarket/addgood.json";
                    var opts = {
                        success: function (model, resp, options) {
                            that.goodModel.set(resp.response_params);
                            that.goodTables.collection.add(that.goodModel);
                            that.mainFormView.trigger("dialog:close");
                        },
                        error: function () {
                            console.log("server conn fail || request url address error!");
                        }
                    }
                    var save = that.goodModel.save(opt.data, opts);
                    if (!save) {
                        //formView.triggerMethod("form:data:invalid", newDoctorClass.validationError);
                    }
                });
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.GoodList.Controller;
});
