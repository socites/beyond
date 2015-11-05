/*******************
LIBRARY NAME: graphs
MODULE: channels
********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /*********************
     FILE NAME: channel.js
     *********************/
    
    var Channel = function (data) {
        "use strict";
    
        Object.defineProperty(this, 'typeID', {
            'get': function () {
                return data.typeID;
            }
        });
    
        Object.defineProperty(this, 'channelName', {
            'get': function () {
                return data.channelName;
            }
        });
    
        var graph;
        Object.defineProperty(this, 'graph', {
            'get': function () {
    
                if (graph) return graph;
    
                var framework = module.framework;
                var contents = module.contents;
                switch (data.asset.entity.ID) {
                    case '1':
                        graph = new framework.Community({
                            'published': data.asset
                        });
                        break;
    
                    case '2':
                        graph = new framework.User({
                            'published': data.asset
                        });
                        break;
    
                    case '3':
                        graph = new contents.Topic({
                            'published': data.asset
                        });
                        break;
    
                    case '5':
                        graph = new contents.Section({
                            'published': data.asset
                        });
                        break;
    
                }
    
                return graph;
    
            }
        });
    
        Object.defineProperty(this, 'origin', {
            'get': function () {
                return data.origin;
            }
        });
    
    };
    
    
    /**********************
     FILE NAME: channels.js
     **********************/
    
    var Channels = function (entityID) {
        "use strict";
    
        var api = {'module': module};
        var Collection = module.model.Collection;
        Collection.call(this, api);
    
        this.attributes.entityID = entityID;
    
        var token;
        if (application.ds.vertical) token = auth.sessions.community.token;
        else token = auth.sessions.vertical.token;
    
        this.attributes.token = token;
    
        this.Item = function (data) {
    
            var channel = new Channel(data);
            return channel;
    
        };
    
    };
    
    
    /***************************
     FILE NAME: entries/entry.js
     ***************************/
    
    var Entry = function (channel, data, dependencies) {
        "use strict";
    
        var graph;
        Object.defineProperty(this, 'graph', {
            'get': function () {
    
                if (graph) return graph;
    
                switch (data.asset.entity.ID) {
    
                    case '1':
                        graph = new dependencies.framework.Community({
                            'published': data.asset
                        });
                        break;
    
                    case '2':
                        graph = new dependencies.framework.User({
                            'published': data.asset
                        });
                        break;
    
                    case '3':
                        graph = new dependencies.contents.Topic({
                            'published': data.asset
                        });
                        break;
    
                    case '4':
                        graph = new dependencies.contents.Article({
                            'published': data.asset
                        });
                        break;
    
                    case '6':
                        graph = new dependencies.contents.Gallery({
                            'published': data.asset
                        });
                        break;
    
                    case '14':
                        graph = new dependencies.contents.OGVideo({
                            'published': data.asset
                        });
                        break;
    
                    case '23':
                        graph = new dependencies.contents.Post({
                            'published': data.asset
                        });
                        break;
    
                    case '26':
                        graph = new dependencies.medicine.Doctor({
                            'published': data.asset
                        });
                        break;
    
                    default:
                        var message = 'invalid graph, entity ID "' +
                            graph.entity.ID + '" is not a valid channel entry';
                        console.error(message);
                        return;
    
                }
    
                return graph;
    
            }
        });
    
        Object.defineProperty(this, 'origin', {
            'get': function () {
                return data.origin;
            }
        });
    
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return data.ID;
            }
        });
    
        var community;
        Object.defineProperty(this, 'community', {
            'get': function () {
                return community;
            }
        });
    
        if (data.community) {
    
            community = new module.framework.Community({
                'published': data.community
            });
    
        }
    
        var sharedBy;
        Object.defineProperty(this, 'sharedBy', {
            'get': function () {
    
                if (sharedBy) return sharedBy;
                if (!data.data || !data.data.sharedBy) return;
    
                sharedBy = new module.framework.User({
                    'published': data.data.sharedBy
                });
    
                return sharedBy;
    
            }
        });
    
        Object.defineProperty(this, 'comments', {
            'get': function () {
    
                if (!data.data) return;
                return data.data.comments;
    
            }
        });
    
        this.remove = function (done) {
    
            if (!auth.session.valid) return;
    
            var params = {
                'token': auth.session.token,
                'channelName': channel.attributes.channelName,
                'ID': this.ID
            };
            module.execute('entries/remove', params, function () {
                channel.cache.invalidate();
                if (done) done();
            });
    
        };
    
    };
    
    
    /*****************************
     FILE NAME: entries/entries.js
     *****************************/
    
    var ChannelEntries = function (channelName) {
        "use strict";
    
        var api = {'module': module, 'path': 'entries'};
        var Collection = module.model.Collection;
        Collection.call(this, api, 'next');
    
        this.attributes.channelName = channelName;
    
        var dependencies;
        if (channelName === 'entries' || channelName === 'topics')
            dependencies = ['libraries/contents/assets'];
        else if (channelName.substr(0, 6) === 'topic-')
            dependencies = ['libraries/contents/assets'];
        else if (channelName.substr(0, 8) === 'section-')
            dependencies = ['libraries/contents/assets'];
        else if (channelName === 'communities')
            dependencies = ['libraries/graphs/model'];
        else if (channelName === 'doctors-members' || channelName === 'doctors-employees' || channelName === 'doctors-all')
            dependencies = ['libraries/medicine/main'];
        else if (channelName.substr(0, 5) === 'user-') {
            dependencies = ['libraries/contents/assets',
                'libraries/medicine/main'];
        }
        else {
            console.error('channel name "' + channelName + '" is invalid');
            return;
        }
    
        this.dependencies = dependencies;
        this.Item = function (data, dependencies) {
    
            if (channelName === 'entries' || channelName === 'topics')
                var entry = new Entry(this, data, {
                    'contents': dependencies[0]
                });
            else if (channelName === 'communities')
                var entry = new Entry(this, data, {
                    'framework': dependencies[0]
                });
            else if (channelName === 'doctors-members' || channelName === 'doctors-employees' || channelName === 'doctors-all')
                var entry = new Entry(this, data, {
                    'medicine': dependencies[0]
                });
            else if (channelName.substr(0, 6) === 'topic-')
                var entry = new Entry(this, data, {
                    'contents': dependencies[0]
                });
            else if (channelName.substr(0, 8) === 'section-')
                var entry = new Entry(this, data, {
                    'contents': dependencies[0]
                });
            else if (channelName.substr(0, 5) === 'user-')
                var entry = new Entry(this, data, {
                    'contents': dependencies[0],
                    'medicine': dependencies[1]
                });
    
            if (!entry || !entry.graph) return;
    
            return entry;
    
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
            'ChannelEntries': ChannelEntries,
            'Channels': Channels
        };
    
    });
    
    
    
    done('libraries/graphs/channels', 'code');

})(beyond.modules.get('libraries/graphs/channels'));