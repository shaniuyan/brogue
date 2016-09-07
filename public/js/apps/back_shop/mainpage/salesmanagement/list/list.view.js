/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/salesmanagement/list/list.html", "bootstrap","bootstrapvalidator","backbone.syphon"],
    function (BrogueApplication, Marionette, formTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.SalesManagementList", function (SalesManagementList, BrogueApplication, Backbone, Marionette, $, _) {
            SalesManagementList.Form = Marionette.ItemView.extend({
                template: formTpl,
                events: {
                    "click .btn-save":"submitHanlder",
                    "click .btn-clear":"clearsalesmanagement"
                },
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                submitHanlder: function (e) {
                    e.preventDefault();
                    var data = Backbone.Syphon.serialize(this);
                    data.goodId = this.model.get("goodId");
                    var opt = {
                        model:this.model,
                        data:data
                    };
                    if(this.xevent){
                        this.xevent.triggerMethod("salesmanagement:add",opt);
                    }
                },
                clearsalesmanagement:function(e){
                    e.preventDefault();
                    var data = Backbone.Syphon.serialize(this);
                    data.goodId = this.model.get("goodId");
                    var opt = {
                        model:this.model,
                        data:data
                    };
                    if(this.xevent){
                        this.xevent.triggerMethod("salesmanagement:clear",opt);
                    }
                },
                onShow: function () {
                    $('#SalesList')
                        .bootstrapValidator({
                            message: 'This value is not valid',
                            feedbackIcons: {
                                valid: 'glyphicon glyphicon-ok',
                                invalid: 'glyphicon glyphicon-remove',
                                validating: 'glyphicon glyphicon-refresh'
                            },
                            fields: {
                                totalprice: {
                                    validators: {
                                        notEmpty: {
                                            message: '总价不能为空'
                                        },
                                        numeric:{
                                            message: '总价必须为数字'
                                        }
                                    }
                                }
                            }
                        });
                    $('#SalesList').submit();
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.SalesManagementList;
    });
