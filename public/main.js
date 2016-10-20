requirejs.config({
    baseUrl: 'js/',
    paths: {
        jquery: "lib/jquery.min",
        zxxfile: "lib/zxxFile",
        tether: "lib/tether-1.3.1/js/tether.min",
        //bootstrap: "lib/bootstrap-3.3.5/dist/js/bootstrap.min",
        bootstrap: "lib/bootstrap/js/bootstrap.min",
        bootboxmin: "lib/bootstrap/js/bootbox.min",
        //bootstrapvalidator:"lib/bootstrapvalidator/js/bootstrapValidator",
        bootstrapvalidator: "lib/bootstrapvalidatormin/js/bootstrapValidator.min",
        jqueryui: "lib/jqueryui/jquery-ui",
        bootstrapmodel: "lib/bootstrap-modal",
        bootstraptransition: "lib/bootstrap-transition",
        underscore: "lib/backbone.marionette/underscore",
        backbone: "lib/backbone.marionette/backbone",
        json2: "lib/backbone.marionette/json2",

        "backbone.picky": "/js/lib/backbone.picky",
        "backbone.syphon": "/js/lib/backbone.syphon",

        marionette: "lib/backbone.marionette/backbone.marionette",
        text: "lib/text",
        tpl: "lib/underscore-tpl",
        json: "lib/require-json",
        //shop后台登录页面
        loginView: "apps/back_shop/login/login.view",
        shopMainView: "apps/back_shop/mainpage/layout/layout.view",
        addMarketQuotientView: 'apps/back_shop/mainpage/marketquotient/form/form.view',
        uploadView: "apps/back_shop/mainpage/resources/album/upload/upload.view"
    },
    'map': {
        '*': {
            'css': 'lib/require-css/css'
        }
    },
    shim: {
        'zxxfile': {deps: ['jquery'], exports: 'zxxfile'},
        'bootstrap': {deps: ['jquery'], exports: 'bootstrap'},
        'bootboxmin': {deps: ['jquery', 'bootstrap'], exports: 'bootboxmin'},
        'underscore': {exports: "_"},
        'backbone': {deps: ['underscore', 'jquery', "json2"], exports: 'Backbone'},
        "backbone.picky": ["backbone", "underscore"],
        //   "nnn": ["backbone","underscore"],
        "backbone.syphon": ["backbone"],
        'bootstrapmodel': {deps: ["bootstraptransition"], exports: 'bootstrapmodel'},
        'marionette': {
            deps: ["backbone"],
            exports: "Marionette"
        },
        'tpl': ["text"],
        'json': ["text"],
        'jqueryui': ["jquery", "css!lib/jqueryui/jquery-ui-1.10.3.custom.css"],
        'loginView': ["css!lib/bootstrap/css/bootstrap.min.css", "css!lib/helpercss/dashboard.css", "css!lib/custom-css/login.css", "css!lib/custom-css/main.css"],
        'shopMainView': ["css!lib/bootstrap/css/bootstrap.min.css", "css!lib/helpercss/dashboard.css", "css!lib/bootstrap-3.3.5/dist/css/font-awesome.css", "css!lib/custom-css/main.css"],
        'bootstrapvalidator': ['jquery', 'bootstrap', "css!lib/bootstrapvalidatormin/css/bootstrapValidator.css"],
        'uploadView': ['zxxfile']
    }
});

require(['app', "apps/back_shop/shop.app"],
    function (AppManager) {
        var sessionId = window.localStorage.sessionId || "";
        var data = {
            sessionId: sessionId,
            deviceType: 1
        };
        $.ajax({
            url: "/api/common/auth/getclientid.json",
            data: data,
            success: function (resp) {
                window.localStorage.sessionId = resp.response_params
            },
            dataType: "json"
        });

        AppManager.start();
    });
