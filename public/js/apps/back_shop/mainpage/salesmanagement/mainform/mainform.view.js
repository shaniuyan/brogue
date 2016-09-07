/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/salesmanagement/mainform/mainform.html", "bootstrap","bootstrapvalidator","backbone.syphon"],
    function (BrogueApplication, Marionette, formTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.SalesMainForm", function (SalesPrice, BrogueApplication, Backbone, Marionette, $, _) {
            SalesPrice.Form = Marionette.ItemView.extend({
                template: formTpl,
                events: {
                    "click .btn-paymentoperation":"submitHanlder"
                },
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                submitHanlder: function (e) {
                    e.preventDefault();
                    var data = Backbone.Syphon.serialize(this);
                    data.pmId = this.model.get("pmId");
                    data.price = this.sjfk;
                    var opt = {
                        model:this.model,
                        data:data
                    };
                    if(this.xevent){
                        this.xevent.triggerMethod("salesmanagement:paymentoperation",opt);
                    }
                },
                onShow: function () {
                    $('#SalesPrice')
                        .bootstrapValidator({
                            message: 'This value is not valid',
                            feedbackIcons: {
                                valid: 'glyphicon glyphicon-ok',
                                invalid: 'glyphicon glyphicon-remove',
                                validating: 'glyphicon glyphicon-refresh'
                            },
                            fields: {
                                price: {
                                    validators: {
                                        notEmpty: {
                                            message: '付款金额不能为空'
                                        },
                                        numeric:{
                                            message: '付款金额必须为数字'
                                        }
                                    }
                                }
                            }
                        });
                    $('#SalesPrice').submit();
                    var that = this;
                    $("input[name='price']").bind('input propertychange',function(){
                        var val = $(this).val();
                        showVal = "0";
                        that.sjfk = "0";
                        if(!isNaN(val)){
                            var shouldprice = that.model.get("totalprice")-that.model.get("alreadypaidmoney");
                            if(parseInt(val)>shouldprice){
                                showVal = parseInt(val) - shouldprice;
                                that.sjfk = shouldprice;
                            }else{
                                that.sjfk = val;
                            }
                        }
                        $("#getchange").html(that.sjfk);
                        $("#givechange").html(showVal);
                    });
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.SalesMainForm;
    });
