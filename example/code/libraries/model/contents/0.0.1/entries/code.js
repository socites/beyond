/*********************
LIBRARY NAME: contents
MODULE: entries
**********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /*******************
     FILE NAME: entry.js
     *******************/
    
    var Entry = function (ID) {
        "use strict";
    
        var graph;
        Object.defineProperty(this, 'graph', {
            'get': function () {
                return graph;
            }
        });
    
        this.fetch = function (callback) {
    
            var params = {
                'ID': ID
            };
    
            module.execute('entries/get', params, function (response) {
    
                if (!response.data || response.data.length !== 1) return;
    
                var contents = module.contents;
                var data = {
                    'published': response.data[0]
                };
    
                switch (data.published.entity.ID) {
                    case '4':
                        graph = new contents.Article(data);
                        break;
    
                    case '6':
                        graph = new contents.Gallery(data);
                        break;
    
                    case '14':
                        graph = new contents.OGVideo(data);
                        break;
    
                    case '23':
                        graph = new contents.Post(data);
                        break;
    
                }
    
                if (callback) callback();
    
                return graph;
    
            });
    
        };
    
    };
    
    
    /*********************
     FILE NAME: entries.js
     *********************/
    
    var Entries = function () {
        "use strict";
    
        var api = {'module': module, 'path': 'entries'};
        var Collection = module.model.Collection;
        Collection.call(this, api);
    
        this.Item = function (data) {
    
            var contents = module.contents;
            var graph;
    
            data = {
                'published': data
            };
    
            switch (data.published.entity.ID) {
                case '4':
                    graph = new contents.Article(data);
                    break;
    
                case '6':
                    graph = new contents.Gallery(data);
                    break;
    
                case '14':
                    graph = new contents.OGVideo(data);
                    break;
    
                case '23':
                    graph = new contents.Post(data);
                    break;
    
            }
    
            return graph;
    
        };
    
    };
    
    
    /********************
     FILE NAME: define.js
     ********************/
    
    var dependencies = [
        'libraries/graphs/model',
        'libraries/contents/assets'
    ];
    
    define(dependencies, function (model, contents) {
        "use strict";
    
        module.model = model;
        module.contents = contents;
    
        return {
            'Entry': Entry,
            'Entries': Entries
        };
    
    });
    
    
    
    done('libraries/contents/entries', 'code');

})(beyond.modules.get('libraries/contents/entries'));