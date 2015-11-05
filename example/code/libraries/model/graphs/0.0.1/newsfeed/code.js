/*******************
LIBRARY NAME: graphs
MODULE: newsfeed
********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /*******************
     FILE NAME: entry.js
     *******************/
    
    var Entry = function (data, dependencies) {
        "use strict";
    
        var graph = function (data) {
    
            var graph;
            switch (data.entity.ID) {
    
                case '2':
                    graph = new dependencies.framework.User({
                        'published': data
                    });
                    break;
    
                case '3':
                    graph = new dependencies.contents.Topic({
                        'published': data
                    });
                    break;
    
                case '4':
                    graph = new dependencies.contents.Article({
                        'published': data
                    });
                    break;
    
                case '6':
                    graph = new dependencies.contents.Gallery({
                        'published': data
                    });
                    break;
    
                case '14':
                    graph = new dependencies.contents.OGVideo({
                        'published': data
                    });
                    break;
    
                case '23':
                    graph = new dependencies.contents.Post({
                        'published': data
                    });
                    break;
    
            }
    
            return graph;
    
        };
    
        this.origin = graph(data.origin);
        this.object = graph(data.object);
        this.target = graph(data.target);
    
    };
    
    
    /**********************
     FILE NAME: newsfeed.js
     **********************/
    
    var Newsfeed = function () {
        "use strict";
    
        var Collection = module.model.Collection;
        var api = {'module': module};
        Collection.call(this, api);
    
        this.dependencies = [
            'libraries/graphs/model',
            'libraries/contents/assets'
        ];
    
        this.Item = function (data, dependencies) {
    
            var entry = new Entry(data, {
                'framework': dependencies[0],
                'contents': dependencies[1]
            });
            return entry;
    
        };
    
    };
    
    
    /********************
     FILE NAME: define.js
     ********************/
    
    var dependencies = ['libraries/graphs/model'];
    
    define(dependencies, function (model) {
        "use strict";
    
        model.model = model;
    
        return Newsfeed;
    
    });
    
    
    
    done('libraries/graphs/newsfeed', 'code');

})(beyond.modules.get('libraries/graphs/newsfeed'));