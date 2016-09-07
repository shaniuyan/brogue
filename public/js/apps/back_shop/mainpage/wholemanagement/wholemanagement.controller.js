/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "bootstrapmodel", "apps/back_shop/mainpage/wholemanagement/layout/layout.view",
    "apps/back_shop/mainpage/wholemanagement/salesform/mainform.view",
    "apps/back_shop/mainpage/wholemanagement/mainform/mainform.view",
    "apps/back_shop/mainpage/wholemanagement/searchgood/good.controller",
    "apps/back_shop/mainpage/wholemanagement/list/list.view",
    "apps/back_shop/mainpage/wholemanagement/detaillist/list.view",
    "apps/back_shop/entity/wholesalemanagement.entities",
    "apps/back_shop/entity/wholesalemanagementdetail.entities"], function (BrogueApplication, bootstrapModel, LayoutView, MainFormView, PriceFormView, goodController, SalesListView, ListView) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.WholeManagement", function (SalesManagementController, BrogueApplication, Backbone, Marionette, $, _) {
        SalesManagementController.Controller = {
            showWholeManagement: function (Region, xobject) {
                var that = this;
                xobject = new Marionette.Object();
                //初始化采购单信息
                xobject.purchase = {purchaserole: "采购人1", purchaseperson: "采购人1", purchasephone: ""};
                that.wholesaleManagementModel = new BrogueApplication.Entities.WurchasingManagement;
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
                    that.wholesaleManagementModel.url = "/api/v1/supermarket/wmaddpurchasinggoods.json";
                    var opts = {
                        success: function (model, resp, options) {
                            var adddetail = new BrogueApplication.Entities.WurchasingManagementDetail;
                            adddetail.set(resp.response_params.purchasingdetail);
                            that.goodListView.collection.unshift(adddetail);
                            that.mainFormView.trigger("dialog:close");
                            var substotalprice = adddetail.get("subtotalprice");
                            var curtotalprice = that.wholesaleManagementModel.get("totalprice")

                            that.wholesaleManagementModel.set("totalprice", substotalprice + curtotalprice);
                            that.salesListView = new SalesListView.Form({
                                model: that.wholesaleManagementModel,
                                xevent: xobject
                            });
                            that.layoutView.saleManagementRegion.show(that.salesListView);
                        },
                        error: function () {
                            console.log("server conn fail || request url address error!");
                        }
                    }
                    opt.data.wmId = that.wholesaleManagementModel.get("wmId");
                    var save = that.wholesaleManagementModel.save(opt.data, opts);
                    if (!save) {
                        //formView.triggerMethod("form:data:invalid", newDoctorClass.validationError);
                    }
                });

                xobject.on("salesmanagement:chooseperson", function () {
                    that.chooseWholeManagement(xobject);
                });

                xobject.on("sales:delsales", function (model) {

                    BrogueApplication.messageDialogRegion.confirm({
                        title: "删除提示", message: "您确认将该信息删除吗?",
                        ok: function () {
                            var data = {wmId: model.get("wmId"), wmDetailId: model.get("wmDetailId")};

                            model.url = "/api/v1/supermarket/wmdelpurchasinggoods.json";
                            var opts = {
                                success: function (model, resp, options) {
                                    var totalprice = that.wholesaleManagementModel.get("totalprice");
                                    var subtotalprice = model.get("subtotalprice");
                                    that.wholesaleManagementModel.set("totalprice", totalprice - subtotalprice);
                                    that.salesListView = new SalesListView.Form({model: that.wholesaleManagementModel});
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
                    that.wholesaleManagementModel.url = "/api/v1/supermarket/wmpaymentoperation.json";
                    var opts = {
                        success: function (model, resp, options) {
                            if (resp.error_code != 1001) {
                                that.chooseWholeManagement(xobject);
                                that.priceFormView.trigger("dialog:close")
                            }
                        },
                        error: function () {
                            console.log("server conn fail || request url address error!");
                        }
                    }
                    var save = that.wholesaleManagementModel.save(opt.data, opts);
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
                    require(["apps/back_shop/mainpage/wholemanagementlist/wholemanagementlist.controller"],function(sholwmanagementlistController){
                        sholwmanagementlistController.showSaleManagementList(xobject);
                    });
                });


                that.chooseWholeManagement(xobject);
            },
            chooseWholeManagement: function (xobject) {
                var that = this;

                that.wholesaleManagementModel.url = "/api/v1/supermarket/addwholesalemanagement.json";
                var opts = {
                    success: function (model, resp, options) {
                        if (resp.error_code != 1001) {
                            that.wholesaleManagementModel.set(resp.response_params);
                            //goodController.showGoodList(xobject);

                            var wmId = that.wholesaleManagementModel.get("wmId");

                            var options = {
                                wmId: wmId,
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
                var save = that.wholesaleManagementModel.save(xobject.purchase, opts);
                if (!save) {
                    //formView.triggerMethod("form:data:invalid", newDoctorClass.validationError);
                }

            },
            showSalesGoods: function (options, xobject) {
                var that = this;
                var region = options.region;
                var listRegion = options.listRegion;
                var opts = {wmId: options.wmId};

                that.salesListView = new SalesListView.Form({model: that.wholesaleManagementModel, xevent: xobject});
                listRegion.show(that.salesListView);
                var fetchGoods = BrogueApplication.request("wholemanagementdetail:entities", opts);
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
                that.priceFormView = new PriceFormView.Form({model: that.wholesaleManagementModel, xevent: xobject});
                BrogueApplication.dialogFormRegion.show(that.priceFormView, {title: "结算窗口", height: 480, width: 400});
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.WholeManagement.Controller;
});
