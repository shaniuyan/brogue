/**
 * Created by wk on 2016/6/28.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/salesmanagement/layout/layout.html"],
  function (BrogueApplication, Marionette, layoutTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.SalesManagementLayout", function (View, BrogueApplication, Backbone, Marionette, $, _) {
      View.SalesManagementLayout = Marionette.LayoutView.extend({
        template: layoutTpl,
        events:{
          "click .btn_addGood":"addGood"
        },
        addGood:function(e){
          /*e.preventDefault();
          $('#myModal').modal('show');*/

          require(["apps/back_shop/mainpage/salesmanagement/searchgoodlist/goodlist.controller"],function(goodListController){
            goodListController.showSearchGoodList();
          });
        },
        regions: {
          //supplySupplierListRegion: ".supplySupplierListRegion"
        }
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.SalesManagementLayout;
  });
