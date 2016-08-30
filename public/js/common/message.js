/**
 * Created by chengdi on 2015/8/17.
 */

define(["marionette", "underscore", "tpl!common/templates/message.tpl.html","jqueryui"], function(Marionette,_,messageTpl){

    MessageDialogView = Marionette.ItemView.extend({
       // template: '<div class="js-tip"><%= message %></div>>',
        template:messageTpl,

        title: "提示标题",
        message: "提示信息",

        serializeData: function(){
            return {
                title: Marionette.getOption(this, "title"),
                message: Marionette.getOption(this, "message")
            }
        },
        initialize: function () {
            if (this.getOption("xevent")) {
                this.xevent = this.getOption("xevent");
            }
        }
    }) ;


    Marionette.Region.Message = Marionette.Region.extend({
        onShow: function(view,$this,options){
            this.listenTo(view, "message:close", this.closeDialog);

            this.innerview=view;
            var self = this;
            var btns ={} ;
            //support xevent and eventname user custom
            var messageok = "message:ok";
            var messagecancel = "message:cancel";

            if (options && options.xeventmessageok)
                messageok = options.xeventmessageok ;
            if (options && options.xeventmessagecancel)
                messagecancel = options.xeventmessagecancel ;
            if (options && options.tiptype ===3 ) {
                btns = {
                    "是": function() {
                        self.closeDialog();
                        if (options && options.ok)
                            options.ok() ;
                        //support event
                        if (options && options.xevent)
                            options.xevent.triggerMethod(messageok);
                    },
                    "否": function() {
                        self.closeDialog();
                        if (options && options.cancel)
                            options.cancel() ;
                        //support event
                        if (options && options.xevent)
                            options.xevent.triggerMethod(messagecancel);
                    }

                };
            }

            if (options && options.tiptype ===2 ) {
                 btns = {
                    "确定": function() {
                        self.closeDialog();
                        if (options && options.ok)
                            options.ok() ;
                        //support event
                        if (options && options.xevent)
                            options.xevent.triggerMethod(messageok);
                    },
                    "取消": function() {
                        self.closeDialog();
                        if (options && options.cancel)
                            options.cancel() ;
                        //support event
                        if (options && options.xevent)
                            options.xevent.triggerMethod(messagecancel);
                    }

                };
            }

            if (options && options.tiptype === 1 ) {
                 btns = {
                    "确定": function() {
                        self.closeDialog();
                        if (options && options.ok)
                            options.ok() ;
                        //support event
                        if (options && options.xevent)
                            options.xevent.triggerMethod(messageok);

                    }

                };
            }

            var dialogopts = {  //默认设置
                modal: true,
                title: view.title,
                //width: "auto",
                minWidth:180 ,
                minHeight:180 ,
                close: function(e, ui){
                    self.closeDialog();
                },
                buttons: btns
            }  ;
            if (options) {
                _.extend(dialogopts,options) ;
            }
            if (options && options.dialogopts) {
                _.extend(dialogopts,options.dialogopts) ;
            }
            this.$el.dialog(dialogopts);
        },

        closeDialog: function(){
            this.stopListening();
            this.empty();
            this.$el.dialog("destroy");
            this.innerview.triggerMethod("message:close");
        },
        alert:function(options){
            var self = this;
            var opts = options || {} ;
            opts.tiptype = 1 ;
            var mview = new MessageDialogView(opts);
            self.show(mview,opts) ;
        },
        confirm:function(options){
            var self = this;
            var opts = options || {} ;
            opts.tiptype = 2 ;
            var mview = new MessageDialogView(opts);
            self.show(mview,opts) ;
        },
        confirm1:function(options){
            var self = this;
            var opts = options || {} ;
            opts.tiptype = 3 ;
            var mview = new MessageDialogView(opts);
            self.show(mview,opts) ;
        }
    });

    return Marionette.Region.Message;
});
