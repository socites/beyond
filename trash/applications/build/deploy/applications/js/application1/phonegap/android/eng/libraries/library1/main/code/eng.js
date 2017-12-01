/*********************
LIBRARY NAME: library1
MODULE: .
**********************/

(function (params) {

    var done = params[1];
    var module = params[0];
    var react = module.react.items;

    /******
    code.js
    ******/
    
    function Library1() {
        "use strict";
    
    }
    
    define(function () {
        "use strict";
    
        return Library1;
    
    });
    
    
    
    done('libraries/library1/main', 'code');

})(beyond.modules.get('libraries/library1/main'));