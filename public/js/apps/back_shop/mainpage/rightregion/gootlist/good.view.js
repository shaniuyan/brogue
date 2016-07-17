/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/rightregion/gootlist/good.html"],
  function (BrogueApplication, Marionette, workspaceTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.GoodList", function (GoodList, BrogueApplication, Backbone, Marionette, $, _) {
      GoodList.View = Marionette.ItemView.extend({
        className:"container",
        template: workspaceTpl,
        events:{
          "click .btn_addgood":"addGood"
        },
        addGood:function(e){
          e.preventDefault();
          window.alert("添加商铺信息");
        }
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.GoodList;
  });
