/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app","bootstrapmodel","apps/back_shop/mainpage/salesmanagement/layout/layout.view",
"apps/back_shop/entity/purchasingmanagement.entities"], function (BrogueApplication,bootstrapModel ,LayoutView) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.SalesManagement", function (SalesManagementController, BrogueApplication, Backbone, Marionette, $, _) {
    SalesManagementController.Controller = {
      showSalesManagement: function (Region, xobject) {
        xobject = new Marionette.Object();
        //初始化采购单信息
        xobject.purchase = {purchaserole:"采购人1",purchaseperson:"采购人1",purchasephone:""};
        var purchasingManagementModel = new BrogueApplication.Entities.PurchasingManagement;
        var that = this;
        that.xobject = xobject;

        var layoutView = new LayoutView.SalesManagementLayout({xevent:xobject});
        Region.show(layoutView);

        xobject.on("salesmanagement:addpurchasing_management",function(){
          //purchasingManagementModel.set("purchaserole",xobject.purchase.purchaserole);
          //purchasingManagementModel.set("purchaseperson",xobject.purchase.purchaseperson);


          purchasingManagementModel.url = "/api/v1/supermarket/addpurchasingmanagement.json";
          var opts = {
            success: function (model, resp, options) {
              if(resp.error_code!=1001){
                purchasingManagementModel.set(resp.response_params);
                //window.alert(purchasingManagementModel.get("pmId"));

                require(["apps/back_shop/mainpage/salesmanagement/searchgood/good.controller"],function(goodController){
                  goodController.showGoodList();
                });
              }
            },
            error: function () {
              console.log("server conn fail || request url address error!");
            }
          }
          var save = purchasingManagementModel.save(xobject.purchase, opts);
          if (!save) {
            //formView.triggerMethod("form:data:invalid", newDoctorClass.validationError);
          }
        });
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.SalesManagement.Controller;
});
