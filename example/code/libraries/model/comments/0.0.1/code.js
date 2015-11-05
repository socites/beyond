/*********************
LIBRARY NAME: comments
MODULE: .
**********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /*********************
     FILE NAME: opinion.js
     *********************/
    
    var Opinion = function (params) {
        "use strict";
    
        var api = {'module': module, 'path': 'opinions'};
    
        var Graph = module.model.Graph;
        var graph = Object.create(Graph.prototype);
        Graph.call(this, api, params);
    
        // define document properties
        this.document.define('text');
    
        this.set = function (params) {
            graph.set.call(this, params);
        };
    
        this.set(params);
    
    };
    
    
    /**********************
     FILE NAME: opinions.js
     **********************/
    
    var Opinions = function () {
        "use strict";
    
        var api = {'module': module, 'path': 'opinions'};
        var Collection = module.model.Collection;
        Collection.call(this, api);
    
        this.Item = function (data) {
    
            return new Opinion({
                'published': data
            });
    
        };
    
    };
    
    
    /********************
     FILE NAME: define.js
     ********************/
    
    var dependencies = ['libraries/graphs/model'];
    
    define(dependencies, function (model) {
        "use strict";
    
        module.model = model;
    
        return {
            'Opinion': Opinion,
            'Opinions': Opinions
        };
    
    });
    
    
    
    done('libraries/comments', 'code');

})(beyond.modules.get('libraries/comments'));