/*******************
LIBRARY NAME: graphs
MODULE: auth/cluster
********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /*************************
     FILE NAME: communities.js
     *************************/
    
    var MyCommunities = function () {
        "use strict";
    
        var api = {'module': module, 'path': 'cluster/communities'};
        var Collection = module.model.Collection;
        Collection.call(this, api);
    
        this.Item = function (data) {
    
            var Community = module.framework.Community;
    
            var community = new Community({
                'published': data
            });
    
            return community;
    
        };
    
    };
    
    
    /********************
     FILE NAME: define.js
     ********************/
    
    var dependencies = [
        'sparta/model/client/module',
        'code/apps/framework/client/module'
    ];
    
    define(dependencies, function (model, framework) {
        "use strict";
    
        module.model = model;
        module.framework = framework;
    
        var myCommunities = new MyCommunities();
    
        return {
            'myCommunities': myCommunities
        };
    
    });
    
    
    
    done('libraries/graphs/auth/cluster', 'code');

})(beyond.modules.get('libraries/graphs/auth/cluster'));