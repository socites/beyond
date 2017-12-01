(function() {

    /***********
    MODULE: cool
    ************/
    
    (function (module) {
    
        module = module[0];
    
        /*********************
        multilanguage compiler
        **********************/
        
        beyond.modules.multilanguage.set('application/cool', ["control"]);
        
        
        /***************
        control compiler
        ****************/
        
        beyond.controls.register({"cool-control": "application/cool"});
        module.control.id = 'cool-control'
        
        
    })(beyond.modules.get('application/cool'));
    
    /**************
    MODULE: module1
    ***************/
    
    (function (module) {
    
        module = module[0];
    
        /*********************
        multilanguage compiler
        **********************/
        
        beyond.modules.multilanguage.set('application/module1', ["code"]);
        
        
        
    })(beyond.modules.get('application/module1'));
    
    /************
    MODULE: tests
    *************/
    
    (function (module) {
    
        module = module[0];
    
        /************
        page compiler
        *************/
        
        beyond.pages.register(module, {"route":"/tests","dependencies":{"controls":["library1-welcome","paper-button","cool-control"],"require":{"libraries/library1/main/code":"Library1","application/tests/page":"Page"}}});
        
        
    })(beyond.modules.get('application/tests'));
    
    /***************
    LIBRARY NAME: ui
    MODULE: toast
    ****************/
    
    (function (module) {
    
        module = module[0];
    
        /*********************
        multilanguage compiler
        **********************/
        
        beyond.modules.multilanguage.set('libraries/ui/toast', ["code"]);
        
        
        
    })(beyond.modules.get('libraries/ui/toast'));
    
    
    
    /*********************
    LIBRARY NAME: library1
    MODULE: icons
    **********************/
    
    (function (module) {
    
        module = module[0];
    
        /*************
        icons compiler
        **************/
        
        beyond.controls.register({"test": {"path":"libraries/library1/icons","type":"icons"}});
        module.control.id = 'test'
        
        
    })(beyond.modules.get('libraries/library1/icons'));
    
    /*********************
    LIBRARY NAME: library1
    MODULE: .
    **********************/
    
    (function (module) {
    
        module = module[0];
    
        /*********************
        multilanguage compiler
        **********************/
        
        beyond.modules.multilanguage.set('libraries/library1/main', ["code"]);
        
        
        /************
        code compiler
        *************/
        
        /*******
        start.js
        *******/
        
        console.log('start', module.ID);
        
        
        
        
        
    })(beyond.modules.get('libraries/library1/main'));
    
    /*********************
    LIBRARY NAME: library1
    MODULE: page
    **********************/
    
    (function (module) {
    
        module = module[0];
    
        /*********************
        multilanguage compiler
        **********************/
        
        beyond.modules.multilanguage.set('libraries/library1/page', ["page"]);
        
        
        /************
        page compiler
        *************/
        
        beyond.pages.register(module, {"route":"/page","dependencies":{"require":{"libraries/library1/page/page":"Page"}}});
        
        
    })(beyond.modules.get('libraries/library1/page'));
    
    /*********************
    LIBRARY NAME: library1
    MODULE: welcome
    **********************/
    
    (function (module) {
    
        module = module[0];
    
        /***************
        control compiler
        ****************/
        
        beyond.controls.register({"library1-welcome": "libraries/library1/welcome"});
        module.control.id = 'library1-welcome'
        
        
    })(beyond.modules.get('libraries/library1/welcome'));
    
    
    
    
    beyond.start();

})();