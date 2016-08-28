/**
 * 程序入口
 */
define(["marionette", "common/dialog"], function (Marionette) {
  var BrogueApplication = new Marionette.Application({
    initialize: function (options) {
      //无论程序是否开始都回执行
      console.log('Application初始化');
    }
  });
  BrogueApplication.sysParams = {
    dataDirection: "local",//service,local
    loginUser: {},
    loginUserNo: "",
    loginToken: ""
  };
  BrogueApplication.addRegions({
    bodyRegion: "#content",
    dialogRegion: Marionette.Region.Dialog.extend({
      el: "#dialogregion"
    }),
    dialogFormRegion: Marionette.Region.Dialog.extend({
      el: "#dialogformregion"
    })
  });

  BrogueApplication.navigate = function (route, options) {
    options || (options = {});
    Backbone.history.navigate(route, options);
  };

  BrogueApplication.getCurrentRoute = function () {
    return Backbone.history.fragment
  };


  BrogueApplication.refresh = function (options) {
    var cur = Backbone.history.fragment;
    Backbone.history.loadUrl(cur);
  };

  BrogueApplication.on("start", function () {
    if (Backbone.history) {
      console.log("应用程序开始！");
      Backbone.history.start();
      if (BrogueApplication.getCurrentRoute() === "") {
        BrogueApplication.trigger("shopback:login");
      }
      else {
        BrogueApplication.trigger("shopback:home");
      }
    }
  });
  return BrogueApplication;
});
