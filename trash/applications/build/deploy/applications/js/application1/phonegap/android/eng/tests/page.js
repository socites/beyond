/************
MODULE: tests
*************/

(function (params) {

    var done = params[1];
    var module = params[0];
    var dependencies = module.dependencies.modules;
    var react = module.react.items;

    var custom = undefined;

    /******************
     MUSTACHE TEMPLATES
     ******************/
    
    template = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<paper-button class=\"load-module1\" raised>Load Module1</paper-button>");t.b("\n");return t.fl(); },partials: {}, subs: {  }});
    module.templates.register("page", template);
    
    
    /******
    page.js
    ******/
    
    function Page($container, parameter, dependencies) {
        "use strict";
    
        function loadModule1() {
    
            require(['application/module1/code'], function (mod1) {
                console.log(mod1);
            });
    
        }
    
        this.preview = function () {
    
            $container.html(module.render('page'));
            $container.find('paper-button.load-module1').click(loadModule1);
    
        };
    
    }
    
    
    
    define([custom], function() {
        if(typeof Page !== "function") {
            console.warn("Module does not have a Page function");
            return;
        }
        return Page;
    });

    done('application/tests', 'code');

})(beyond.modules.get('application/tests'));