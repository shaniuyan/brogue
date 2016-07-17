define(["marionette", "underscore", "jqueryui"], function (Marionette, _) {
  Marionette.Region.Dialog = Marionette.Region.extend({
    onShow: function (view, $this, options) {
      this.listenTo(view, "dialog:close", this.closeDialog);
      this.innerview = view;
      var self = this;
      var dialogopts = {  //默认设置
        modal: true,
        title: view.title,
        width: "auto",
        //  position:"center",
        close: function (e, ui) {
          self.closeDialog();
        }
      };
      if (options) {
        _.extend(dialogopts, options);
      }
      if (options && options.dialogopts) {
        _.extend(dialogopts, options.dialogopts);
      }
      this.$el.dialog(dialogopts);
    },

    closeDialog: function () {
      this.stopListening();
      this.empty();
      this.$el.dialog("destroy");
      this.innerview.triggerMethod("dialog:close");
    }
  });

  return Marionette.Region.Dialog;
});
