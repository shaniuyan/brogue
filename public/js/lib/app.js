/**
 * 程序入口
 */
define(["marionette"], function (Marionette) {
  var BrogueApp = new Marionette.Application({
    initialize: function (options) {
      //无论程序是否开始都回执行
      console.log('Application初始化');
    }
  });

  BrogueApp.addRegions({
    bodyRegion: "body"
  });

  BrogueApp.on("start", function () {
    if (Backbone.history) {
      console.log("应用程序开始！");
      Backbone.history.start();

    }
  });

  return BrogueApp;
});
