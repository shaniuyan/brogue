/**
 * Created by wk on 2016/6/28.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/salesmanagement/layout/layout.html"],
  function (BrogueApplication, Marionette, layoutTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.SalesManagementLayout", function (View, BrogueApplication, Backbone, Marionette, $, _) {
      View.SalesManagementLayout = Marionette.LayoutView.extend({
        template: layoutTpl,
        events:{
          "click .btn_addGood":"addGood",
          "click .purchaserole":"purchaserole"
        },
        initialize: function () {
          if (this.getOption("xevent")) {
            this.xevent = this.getOption("xevent");
          }
        },
        addGood:function(e){
          e.preventDefault();
          /*$('#myModal').modal('show');*/
          if(this.xevent){
            this.xevent.triggerMethod("salesmanagement:addpurchasing_management")
          }
          /*require(["apps/back_shop/mainpage/salesmanagement/searchgoodlist/goodlist.controller"],function(goodListController){
            goodListController.showSearchGoodList();
          });*/
        },
        purchaserole:function(e){
          e.preventDefault();
          var purchaserole = e.target.innerHTML;
          this.xevent.purchase.purchaserole = purchaserole;
          this.xevent.purchase.purchaseperson = purchaserole;
          $(e.target).addClass("btn-default");
          $(".purchaserole").removeClass("btn-success");
          $(e.target).addClass("btn-success");
        },
        regions: {
          //supplySupplierListRegion: ".supplySupplierListRegion"
        }
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.SalesManagementLayout;
  });
