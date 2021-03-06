/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "bootstrapmodel", "apps/back_shop/mainpage/salesmanagement/layout/layout.view",
    "apps/back_shop/mainpage/salesmanagement/salesform/mainform.view",
    "apps/back_shop/mainpage/salesmanagement/mainform/mainform.view",
    "apps/back_shop/mainpage/salesmanagement/searchgood/good.controller",
    "apps/back_shop/mainpage/salesmanagement/list/list.view",
    "apps/back_shop/mainpage/salesmanagement/detaillist/list.view",
    "apps/back_shop/entity/purchasingmanagement.entities",
    "apps/back_shop/entity/purchasingmanagementdetail.entities"], function (BrogueApplication, bootstrapModel, LayoutView, MainFormView, PriceFormView, goodController, SalesListView, ListView) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.SalesManagement", function (SalesManagementController, BrogueApplication, Backbone, Marionette, $, _) {
        SalesManagementController.Controller = {
            showSalesManagement: function (Region, xobject) {
                var that = this;
                xobject = new Marionette.Object();
                //初始化采购单信息
                xobject.purchase = {purchaserole: "采购人1", purchaseperson: "采购人1", purchasephone: ""};
                that.purchasingManagementModel = new BrogueApplication.Entities.PurchasingManagement;
                var that = this;
                that.xobject = xobject;

                that.layoutView = new LayoutView.SalesManagementLayout({xevent: xobject});
                Region.show(that.layoutView);

                xobject.on("salesmanagement:addpurchasing_management", function () {
                    goodController.showGoodList(xobject);
                });

                xobject.on("sales:addgood", function (model) {
                    model.set("scatterednum", 1);
                    model.set("wholenum", 1);
                    that.mainFormView = new MainFormView.Form({model: model, xevent: xobject});
                    BrogueApplication.dialogFormRegion.show(that.mainFormView, {
                        title: "出售信息",
                        height: 430,
                        width: 400
                    });
                });
                xobject.on("sales:retail", function (model) {
                    BrogueApplication.messageDialogRegion.confirm({
                        title: "零售操作提示", message: "您确认要添加零售信息吗?",
                        ok: function () {
                            var data = {
                                goodId:model.get("goodId"),
                                wholenum:1
                            };

                            model.url = "/api/v1/supermarket/unboxing.json";
                            var opts = {
                                success: function (model, resp, options) {
                                    model.set(resp.response_params);
                                    xobject.goodListView.render();
                                },
                                error: function () {
                                    console.log("server conn fail || request url address error!");
                                }
                            }
                            var save = model.save(data, opts);
                            if (!save) {
                                //formView.triggerMethod("form:data:invalid", newDoctorClass.validationError);
                            }

                            //
                        },
                        cancel: function () {
                        }
                    });
                });

                xobject.on("salesmanagement:add", function (opt) {
                    that.purchasingManagementModel.url = "/api/v1/supermarket/addpurchasinggoods.json";
                    var opts = {
                        success: function (model, resp, options) {
                            var adddetail = new BrogueApplication.Entities.PurchasingManagementDetail;
                            adddetail.set(resp.response_params.purchasingdetail);
                            that.goodListView.collection.unshift(adddetail);
                            that.mainFormView.trigger("dialog:close");
                            var substotalprice = adddetail.get("subtotalprice");
                            var curtotalprice = that.purchasingManagementModel.get("totalprice")

                            that.purchasingManagementModel.set("totalprice", substotalprice + curtotalprice);
                            that.salesListView = new SalesListView.Form({
                                model: that.purchasingManagementModel,
                                xevent: xobject
                            });
                            that.layoutView.saleManagementRegion.show(that.salesListView);
                        },
                        error: function () {
                            console.log("server conn fail || request url address error!");
                        }
                    }
                    opt.data.pmId = that.purchasingManagementModel.get("pmId");
                    var save = that.purchasingManagementModel.save(opt.data, opts);
                    if (!save) {
                        //formView.triggerMethod("form:data:invalid", newDoctorClass.validationError);
                    }
                });

                xobject.on("salesmanagement:chooseperson", function () {
                    that.chooseSalesManagement(xobject);
                });

                xobject.on("sales:delsales", function (model) {

                    BrogueApplication.messageDialogRegion.confirm({
                        title: "删除提示", message: "您确认将该信息删除吗?",
                        ok: function () {
                            var data = {pmId: model.get("pmId"), pmDetailId: model.get("pmDetailId")};

                            model.url = "/api/v1/supermarket/delpurchasinggoods.json";
                            var opts = {
                                success: function (model, resp, options) {
                                    var totalprice = that.purchasingManagementModel.get("totalprice");
                                    var subtotalprice = model.get("subtotalprice");
                                    that.purchasingManagementModel.set("totalprice", totalprice - subtotalprice);
                                    that.salesListView = new SalesListView.Form({model: that.purchasingManagementModel});
                                    that.layoutView.saleManagementRegion.show(that.salesListView);
                                    model.destroy();
                                },
                                error: function () {
                                    console.log("server conn fail || request url address error!");
                                }
                            }
                            var save = model.save(data, opts);
                            if (!save) {
                                //formView.triggerMethod("form:data:invalid", newDoctorClass.validationError);
                            }

                            //
                        },
                        cancel: function () {
                        }
                    });


                });

                xobject.on("salesmanagement:paymentoperation", function (opt) {
                    that.purchasingManagementModel.url = "/api/v1/supermarket/paymentoperation.json";
                    var opts = {
                        success: function (model, resp, options) {
                            if (resp.error_code != 1001) {
                                that.chooseSalesManagement(xobject);
                                that.priceFormView.trigger("dialog:close")
                            }
                        },
                        error: function () {
                            console.log("server conn fail || request url address error!");
                        }
                    }
                    var save = that.purchasingManagementModel.save(opt.data, opts);
                    if (!save) {
                        //formView.triggerMethod("form:data:invalid", newDoctorClass.validationError);
                    }
                });

                xobject.on("salesmanagement:clear", function (opt) {

                    if (!that.goodListView.collection.length) {
                        BrogueApplication.messageDialogRegion.alert({
                            title: "结算提示", message: "请添加出售商品！"
                        });
                        return;
                    }
                    if (xobject.GoodlayoutView) {
                        xobject.GoodlayoutView.trigger("dialog:close");
                    }
                    that.showPriceView(xobject);
                });

                xobject.on("salesmanagement:salesmanagementlist",function(){
                    xobject.param = {
                        paystatus:0
                    };
                    require(["apps/back_shop/mainpage/salesmanagementlist/salesmanagementlist.controller"],function(salesmanagementlistController){
                        salesmanagementlistController.showManagementList(xobject);
                    });
                });


                that.chooseSalesManagement(xobject);
            },
            chooseSalesManagement: function (xobject) {
                var that = this;

                that.purchasingManagementModel.url = "/api/v1/supermarket/addpurchasingmanagement.json";
                var opts = {
                    success: function (model, resp, options) {
                        if (resp.error_code != 1001) {
                            that.purchasingManagementModel.set(resp.response_params);
                            //goodController.showGoodList(xobject);

                            var pmId = that.purchasingManagementModel.get("pmId");

                            var options = {
                                pmId: pmId,
                                listRegion: that.layoutView.saleManagementRegion,
                                region: that.layoutView.goodListRegion
                            };

                            that.showSalesGoods(options, xobject);
                        }
                    },
                    error: function () {
                        console.log("server conn fail || request url address error!");
                    }
                }
                var save = that.purchasingManagementModel.save(xobject.purchase, opts);
                if (!save) {
                    //formView.triggerMethod("form:data:invalid", newDoctorClass.validationError);
                }

            },
            showSalesGoods: function (options, xobject) {
                var that = this;
                var region = options.region;
                var listRegion = options.listRegion;
                var opts = {pmId: options.pmId};

                that.salesListView = new SalesListView.Form({model: that.purchasingManagementModel, xevent: xobject});
                listRegion.show(that.salesListView);
                var fetchGoods = BrogueApplication.request("purchasingmanagementdetail:entities", opts);
                $.when(fetchGoods).done(function (goods) {
                    that.goodListView = new ListView.Table({
                        collection: goods,
                        xevent: xobject,
                        childViewOptions: {xevent: xobject}
                    });
                    region.show(that.goodListView);
                });
            },
            showPriceView: function (xobject) {
                var that = this;
                that.priceFormView = new PriceFormView.Form({model: that.purchasingManagementModel, xevent: xobject});
                BrogueApplication.dialogFormRegion.show(that.priceFormView, {title: "结算窗口", height: 480, width: 400});
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.SalesManagement.Controller;
});
