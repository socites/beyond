/*********************
LIBRARY NAME: library1
MODULE: page
**********************/

(function (params) {

    var done = params[1];
    var module = params[0];
    var dependencies = module.dependencies.modules;
    var react = module.react.items;

    var custom = "application/custom/library1/page";

    /************
     Module texts
     ************/
    
    var texts = JSON.parse('{"title":"La página"}');
    if(!module.texts) module.texts = {};
    $.extend(module.texts, texts);
    
    
    
    /******
    page.js
    ******/
    
    function Page($container) {
        "use strict";
    
        this.preview = function () {
            console.log('page preview');
        };
    
    }
    
    
    
    define([custom], function() {
        if(typeof Page !== "function") {
            console.warn("Module does not have a Page function");
            return;
        }
        return Page;
    });

    done('libraries/library1/page', 'code');

})(beyond.modules.get('libraries/library1/page'));