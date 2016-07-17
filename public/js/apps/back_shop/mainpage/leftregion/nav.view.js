/**
 * Created by wk on 2015年6月10日 09:46:47
 */
define(["app",
    "tpl!apps/back_shop/mainpage/leftregion/ul.html",
    "tpl!apps/back_shop/mainpage/leftregion/li.html",
    "tpl!apps/back_shop/mainpage/leftregion/none.html"],
  function (BrogueApplication, navTpl, navItemTpl, noneTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.LeftView", function (View, BrogueApplication, Backbone, Marionette, $, _) {
      //子节点试图
      View.Li = Marionette.ItemView.extend({
        template: navItemTpl,
        tagName: "li",
        className: "li moduleicon",
        initialize: function () {
          if (this.getOption("xevent")) {
            this.xevent = this.getOption("xevent");
          }
        },
        onRender: function () {
        },
        events: {
          "click .module_name":"showmodule"
        },
        showmodule:function(e){
          e.preventDefault();
          $(".moduleicon").attr("style","background-color:#99CC66;");
          $(e.target).parent().attr("style","background-color:#EEEEEE;");
          if(this.xevent){
            this.xevent.triggerMethod("module:itemclick",this.model);
          }
        }
      });
      View.Ul = Marionette.CompositeView.extend({
        tagName: "div",
        template: navTpl,
        childView: View.Li,
        childViewContainer: "ul",
        initialize: function () {
          this.collection = this.model.childModuls;
        },
        appendHtml: function (cv, iv) {
        }
      });

      var NoneView = Marionette.ItemView.extend({
        template: noneTpl,
        tagName: "div",
        className: "sidebar-nav"
      });

      View.UlCollection = Backbone.Marionette.CollectionView.extend({
        template: navTpl,
        childView: View.Ul,
        emptyView: NoneView
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.LeftView;
  });
