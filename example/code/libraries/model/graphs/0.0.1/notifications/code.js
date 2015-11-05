/********************
LIBRARY NAME: graphs
MODULE: notifications
*********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /***************************
     FILE NAME: notifications.js
     ***************************/
    
    var Notifications = function () {
        "use strict";
    
        var Collection = module.model.Collection;
        var api = {'module': module};
        Collection.call(this, api);
    
    };
    
    
    /********************
     FILE NAME: define.js
     ********************/
    
    var dependencies = ['libraries/graphs/model'];
    
    define(dependencies, function (model) {
        "use strict";
    
        module.model = model;
    
        return {
            'Notifications': Notifications
        };
    
    });
    
    
    
    done('libraries/graphs/notifications', 'code');

})(beyond.modules.get('libraries/graphs/notifications'));