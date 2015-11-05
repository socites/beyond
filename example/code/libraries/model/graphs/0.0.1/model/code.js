/*******************
LIBRARY NAME: graphs
MODULE: model
********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /*************************************************
     FILE NAME: collection/pages/controllers/object.js
     *************************************************/
    
    var ObjectController = function (collection, page, object) {
        "use strict";
    
        var linkable = typeof object.bind === 'function';
    
        var onRemoved = function () {
            collection.cache.invalidate();
        };
    
        var onDiscarded = function () {
            collection.cache.invalidate();
        };
    
        var onChange = function () {
            collection.cache.invalidate();
        };
    
        if (linkable) {
            object.bind('removed', onRemoved);
            object.bind('discarded', onDiscarded);
            object.bind('change', onChange);
        }
    
        this.unbind = function () {
    
            if (!linkable) return;
    
            object.unbind('removed', onRemoved);
            object.unbind('discarded', onDiscarded);
            object.unbind('change', onChange);
    
        };
    
    };
    
    
    /***********************************
     FILE NAME: collection/pages/page.js
     ***********************************/
    
    var CollectionPage = function (collection, pagination) {
        "use strict";
    
        var index, limit;
        var start, next;
        if (pagination.type === 'offset') {
    
            index = pagination.index;
            limit = pagination.limit;
    
        }
        else {
    
            start = pagination.start;
    
            Object.defineProperty(this, 'next', {
                'get': function () {
                    return next;
                }
            });
    
        }
    
        var self = this;
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        var fetched = false;
        Object.defineProperty(this, 'fetched', {
            'get': function () {
                return fetched;
            }
        });
    
        var fetching = false;
        Object.defineProperty(this, 'fetching', {
            'get': function () {
                return fetching;
            }
        });
    
        var objects = [];
        var dependencies;
    
        // graph controllers
        var controllers = [];
        Object.defineProperty(this, 'objects', {
            'get': function () {
                return objects;
            }
        });
    
        var invalidateCache = function () {
    
            var module = collection.api.module;
            var path = '';
            if (collection.api.path) path = collection.api.path + '/';
    
            var request;
            request = new module.dispatcher.Request(module, path + 'get', self.params);
            var removed = module.dispatcher.cache.invalidate(request);
    
            return removed;
    
        };
    
        var cache = {
            'read': false,
            'write': false,
            'invalidate': function () {
                invalidateCache();
            }
        };
        Object.defineProperty(this, 'cache', {
            'get': function () {
                return cache;
            },
            'set': function (value) {
                if (typeof value === 'object') {
    
                    cache.read = value.read;
                    cache.write = value.write;
    
                }
                else {
                    console.error('invalid cache configuration');
                }
            }
        });
    
        Object.defineProperty(this, 'offset', {
            'get': function () {
                return (index - 1) * limit;
            }
        });
    
        Object.defineProperty(this, 'index', {
            'get': function () {
                return index;
            }
        });
    
        Object.defineProperty(this, 'limit', {
            'get': function () {
                return limit;
            }
        });
    
        Object.defineProperty(this, 'length', {
            'get': function () {
                return objects.length;
            }
        });
    
        var params;
        Object.defineProperty(this, 'params', {
            'get': function () {
    
                if (params) return params;
    
                var params = {};
                $.extend(params, collection.attributes);
    
                if (pagination.type === 'offset') {
                    params.offset = this.offset;
                    params.limit = this.limit;
                }
                else {
                    params.start = start;
                }
    
                return params;
    
            }
        });
    
        var source;
        Object.defineProperty(this, 'source', {
            'get': function () {
                return source;
            }
        });
    
        var fetch = function (options) {
    
            if (fetched) console.warn('collection fetched again');
    
            var module = collection.api.module;
            var path = '';
            if (collection.api.path) path = collection.api.path + '/';
    
            module.execute(path + 'get', self.params, function (response, cache) {
    
                if (cache) source = 'cache';
                else source = 'rpc';
    
                controllers = [];
                for (var i in response.data) {
    
                    var object = response.data[i];
    
                    if (collection.Item) object = collection.Item(object, dependencies);
                    if (!object) continue;
    
                    objects.push(object);
                    controllers.push(new ObjectController(collection, self, object));
    
                }
    
                if (pagination.type === 'start') {
                    next = response.next;
                }
    
                fetched = true;
                fetching = false;
                events.trigger('fetched', objects);
    
            }, options.cache ? {'cache': options.cache} : {'cache': cache});
    
        };
    
        this.fetch = function (options) {
    
            if (!options) options = {};
    
            if (fetching || fetched) return;
            fetching = true;
    
            if (collection.Item && typeof collection.Item !== 'function') {
                console.error('Item function must be defined', this);
                return;
            }
    
            if (!collection.dependencies) fetch(options);
            else {
    
                require(collection.dependencies, function () {
                    dependencies = [];
                    for (var i in arguments) dependencies.push(arguments[i]);
    
                    fetch(options);
                });
    
            }
    
        };
    
        this.unbind = function () {
            for (var i in controllers) controllers[i].unbind();
        };
    
        this.shift = function (object) {
            for (var i in objects) {
    
                if (objects[i] === object) {
    
                    objects.splice(i, 1);
                    events.trigger('shifted', i, object);
    
                }
    
            }
        };
    
    };
    
    
    /************************************
     FILE NAME: collection/pages/pages.js
     ************************************/
    
    var CollectionPages = function (collection, paginationType) {
        "use strict";
    
        var self = this;
    
        var pages = {};
        Object.defineProperty(this, 'fetched', {
            'get': function () {
                return pages;
            }
        });
    
        // default limit size is 30
        var limit = 30;
        Object.defineProperty(this, 'limit', {
            'get': function () {
                return limit;
            },
            'set': function (value) {
                limit = value;
            }
        });
    
        this.shift = function (object) {
    
            for (var i in pages) pages[i].shift(object);
    
        };
    
        if (paginationType === 'offset') {
    
            Object.defineProperty(this, 'length', {
                'get': function () {
    
                    if (collection.length === undefined || collection.length === 0)
                        return collection.length;
    
                    return (parseInt((collection.length - 1) / limit)) + 1;
    
                }
            });
    
        }
    
        this.get = function (index) {
    
            if (typeof index !== 'number') {
                console.error('invalid index');
                return;
            }
    
            if (pages[index]) {
                return pages[index];
            }
    
            var page;
            if (paginationType === 'offset') {
    
                if (index < 1 || (this.length && index > this.length)) {
                    console.error('index out of range', collection);
                    return;
                }
    
                page = new CollectionPage(collection, {'type': 'offset', 'index': index, 'limit': limit});
    
            }
            else {
    
                var next;
                if (index > 1) {
    
                    var prev = pages[index - 1];
                    if (!prev) {
                        console.error('previous page must be loaded');
                        return;
                    }
                    if (!prev.next) {
                        console.error('there are no more pages to be loaded');
                        return;
                    }
    
                    next = prev.next;
    
                }
    
                page = new CollectionPage(collection, {'type': 'start', 'start': next});
    
            }
    
            pages[index] = page;
    
            return page;
    
        };
    
        this.clean = function () {
            pages = {};
        };
    
        var invalidateCache = function () {
    
            var cont = true;
            var i = 1;
    
            while (cont) {
    
                var page = self.get(i);
                var removed = page.cache.invalidate();
                cont = removed;
    
            }
    
        };
    
        this.cache = {
            'invalidate': invalidateCache
        };
    
    };
    
    
    /***********************************
     FILE NAME: collection/collection.js
     ***********************************/
    
    // paginationType is a string and can be 'start' or 'offset'
    //  'start' means that each page starts with an item
    //  'offset' means that pages are set by offset and limit
    
    var Collection = function (api, paginationType) {
        "use strict";
    
        if (!paginationType) paginationType = 'offset';
    
        if (typeof api !== 'object' || !api.module) {
            console.error('invalid collection api', api);
            return;
        }
    
        Object.defineProperty(this, 'api', {
            'get': function () {
    
                return {
                    'module': api.module,
                    'path': api.path
                };
    
            }
        });
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        var synchronizing = false;
        Object.defineProperty(this, 'synchronizing', {
            'get': function () {
                return synchronizing;
            }
        });
    
        var Item;
        Object.defineProperty(this, 'Item', {
            'get': function () {
                return Item;
            },
            'set': function (value) {
                Item = value;
            }
        });
    
        var attributes = {};
        Object.defineProperty(this, 'attributes', {
            'get': function () {
                return attributes;
            }
        });
    
        var pages = new CollectionPages(this, paginationType);
        Object.defineProperty(this, 'pages', {
            'get': function () {
                return pages;
            }
        });
    
        var pushed = [];
        Object.defineProperty(this, 'pushed', {
            'get': function () {
                return pushed;
            }
        });
    
        this.push = function (object) {
    
            pushed.push(object);
            events.trigger('pushed', object);
    
            this.cache.invalidate();
    
        };
    
        this.shift = function (object) {
    
            var index = pushed.indexOf(object);
            if (index !== -1) {
                pushed.splice(index, 1);
                events.trigger('pushed:shifted', object, index);
            }
    
            pages.shift(object);
    
        };
    
        // invalidate the cache of all the pages
        this.cache = {
            'invalidate': function () {
    
                pages.cache.invalidate();
    
                var module = api.module;
                var path = '';
                if (api.path) path = api.path + '/';
    
                var request = new module.dispatcher.Request(module, path + 'count', self.params);
                module.dispatcher.cache.invalidate(request);
    
            }
        };
    
        var length;
        if (paginationType === 'offset') {
    
            Object.defineProperty(this, 'length', {
                'get': function () {
                    return length;
                }
            });
    
            this.count = function (callback, cache) {
    
                if (cache && length) {
                    if (callback) callback(length);
                    return;
                }
    
                var module = api.module;
                var path = '';
                if (api.path) path = api.path + '/';
    
                module.execute(path + 'count', attributes, function (response) {
                    length = response.data;
                    if (callback) callback(length);
                });
    
            };
    
        }
    
    };
    
    
    /*************************
     FILE NAME: drafts/load.js
     *************************/
    
    var loadDraft = function (collectionID, ID, callback) {
        "use strict";
    
        var params = {'collectionID': collectionID, 'ID': ID};
        params.token = auth.sessions.community.token;
    
        module.execute('get', params, function (response) {
            if (callback) callback(response.data[0]);
        });
    
    };
    
    
    /*************************
     FILE NAME: drafts/save.js
     *************************/
    
    var saveDraft = function (collectionID, ID, data, callback) {
        "use strict";
    
        data = JSON.stringify(data);
    
        var params = {'collectionID': collectionID, 'ID': ID, 'data': data};
        params.token = auth.sessions.community.token;
    
        module.execute('save', params, function (response) {
            if (callback) callback(response.data);
        });
    
    };
    
    
    /***************************
     FILE NAME: drafts/remove.js
     ***************************/
    
    var removeDraft = function (collectionID, ID, callback) {
        "use strict";
    
        var params = {'collectionID': collectionID, 'ID': ID};
        params.token = auth.sessions.community.token;
    
        module.execute('remove', params, function () {
            if (callback) callback();
        });
    
    };
    
    
    /***************************
     FILE NAME: drafts/drafts.js
     ***************************/
    
    var Drafts = function () {
        "use strict";
    
        var api = {'module': module};
        Collection.call(this, api);
    
        this.dependencies = ['libraries/contents/assets'];
    
        this.Item = function (draft, dependencies) {
    
            var contents = dependencies[0];
            if (!draft.data || !draft.data.entity) return;
    
            var graph = draft.data;
            graph.draft = draft.ID;
    
            switch (draft.data.entity.ID) {
    
                case '4':
                    graph = new contents.Article({
                        'stored': graph
                    });
                    break;
    
                case '6':
                    graph = new contents.Gallery({
                        'stored': graph
                    });
                    break;
    
                case '14':
                    graph = new contents.OGVideo({
                        'stored': graph
                    });
                    break;
    
                case '23':
                    graph = new contents.Post({
                        'stored': draft.data
                    });
                    break;
    
            }
    
            return graph;
    
        };
    
    };
    
    
    /***************************************
     FILE NAME: graph/properties/property.js
     ***************************************/
    
    var Property = function (graph, key, name) {
        "use strict";
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        var UNKNOWN = module.UNKNOWN;
        Object.defineProperty(this, 'UNKNOWN', {
            'get': function () {
                return UNKNOWN;
            }
        });
    
        var EMPTY = module.EMPTY;
        Object.defineProperty(this, 'EMPTY', {
            'get': function () {
                return EMPTY;
            }
        });
    
        Object.defineProperty(this, 'name', {
            'get': function () {
                return name;
            }
        });
    
        var value = EMPTY;
        Object.defineProperty(this, 'value', {
            'get': function () {
    
                if (value !== EMPTY) return value;
                if (stored !== EMPTY && stored !== UNKNOWN) return stored;
                return published;
    
            },
            'set': function (_value) {
    
                if (value !== _value) {
    
                    var prev = this.value;
                    value = _value;
                    if (prev !== this.value) events.trigger('change', this.value);
    
                }
    
            }
        });
    
        Object.defineProperty(this, 'strValue', {
            'get': function () {
                var value = this.value;
                if (value === EMPTY) return '';
    
                return value;
            }
        });
    
        var stored = UNKNOWN;
        Object.defineProperty(this, 'stored', {
            'get': function () {
                return stored;
            },
            'set': function (value) {
                stored = value;
            }
        });
    
        var published = UNKNOWN;
        Object.defineProperty(this, 'published', {
            'get': function () {
                return published;
            },
            'set': function (value) {
                published = value;
            }
        });
    
        Object.defineProperty(this, 'unsaved', {
            'get': function () {
    
                if (stored === UNKNOWN) return UNKNOWN;
                return value !== stored;
    
            }
        });
    
        Object.defineProperty(this, 'edited', {
            'get': function () {
    
                if (published === UNKNOWN) return UNKNOWN;
                return published !== this.value;
    
            }
        });
    
        this.dump = function () {
    
            if (value !== EMPTY) published = value;
            value = EMPTY;
    
        };
    
    };
    
    
    /**************************************
     FILE NAME: graph/properties/changes.js
     **************************************/
    
    var PropertiesChanges = function (graph, properties) {
        "use strict";
    
        var UNKNOWN = module.UNKNOWN;
    
        Object.defineProperty(this, 'edited', {
            'get': function () {
    
                var edited = {};
                for (var name in properties) {
    
                    var property = properties[name];
                    if (property.edited) edited[name] = property.value;
    
                }
    
                var count = 0;
                for (var i in edited) count++;
                if (!count) return;
    
                return edited;
    
            }
        });
    
    };
    
    
    /*****************************************
     FILE NAME: graph/properties/properties.js
     *****************************************/
    
    var Properties = function (graph, key) {
        "use strict";
    
        var events = new Events();
        this.bind = function (event, listener) {
            events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            events.unbind(event, listener);
        };
    
        var properties = {};
        Object.defineProperty(this, 'iterator', {
            'get': function () {
                return properties;
            }
        });
    
        var EMPTY = module.EMPTY;
        Object.defineProperty(this, 'EMPTY', {
            'get': function () {
                return EMPTY;
            }
        });
    
        Object.defineProperty(this, 'empty', {
            'get': function () {
                for (var i in properties)
                    if (properties[i].value !== EMPTY) return false;
    
                return true;
            }
        });
    
        var UNKNOWN = module.UNKNOWN;
        Object.defineProperty(this, 'UNKNOWN', {
            'get': function () {
                return UNKNOWN;
            }
        });
    
        var changes = new PropertiesChanges(graph, properties);
        Object.defineProperty(this, 'changes', {
            'get': function () {
                return changes;
            }
        });
    
        var loaded;
        Object.defineProperty(this, 'loaded', {
            'get': function () {
                return loaded;
            }
        });
    
        Object.defineProperty(this, 'unsaved', {
            'get': function () {
    
                if (graph.stored && !graph.loaded) return UNKNOWN;
    
                for (var i in properties) {
                    if (properties[i].unsaved === true) return true;
                }
    
                return false;
    
            }
        });
    
        Object.defineProperty(this, 'edited', {
            'get': function () {
    
                for (var i in properties) {
    
                    if (properties[i].edited === UNKNOWN) {
                        return UNKNOWN;
                    }
    
                    if (properties[i].edited === true) {
                        return true;
                    }
    
                }
    
                return false;
    
            }
        });
    
        this.define = function (name) {
    
            var property = new Property(graph, key, name);
            property.bind('change', function () {
                events.trigger('change', property);
            });
    
            properties[name] = property;
    
            Object.defineProperty(this, name, {
                'get': function () {
                    return properties[name];
                }
            });
    
        };
    
        // set the values of the properties
        // @state can be: stored, published
        this.set = function (state, values) {
    
            for (var name in properties) {
                properties[name][state] = EMPTY;
            }
    
            for (var name in values) {
    
                if (!properties[name]) {
                    console.error('invalid property "' + name + '" on "' + key + '"', values);
                    continue;
                }
    
                switch (state) {
    
                    case 'memory':
                        properties[name].value = values[name];
                        break;
    
                    case 'stored':
                        properties[name].stored = values[name];
                        break;
    
                    case 'published':
                        properties[name].published = values[name];
                        break;
    
                }
    
            }
    
        };
    
    
        // set all persisted values with their memory values
        this.dump = function () {
    
            for (var name in this.iterator) this.iterator[name].dump();
    
        };
    
        Object.defineProperty(this, 'JSON', {
            'get': function () {
    
                var JSON = {};
                for (var name in this.iterator) {
                    var json = this.iterator[name].published;
                    if (json === module.EMPTY || json === module.UNKNOWN) json = '';
                    JSON[name] = json;
                }
    
                return JSON;
    
            }
        });
    
    };
    
    
    /********************************
     FILE NAME: graph/picture/temp.js
     ********************************/
    
    var Temp = function (picture, graph) {
        "use strict";
    
        var stored = picture.UNKNOWN;
    
        var ID = picture.EMPTY;
        Object.defineProperty(this, 'ID', {
            'get': function () {
    
                if (ID !== picture.EMPTY) return ID;
    
                if (stored === picture.UNKNOWN) return picture.UNKNOWN;
    
                if (stored !== picture.EMPTY) return stored;
    
                return picture.EMPTY;
    
            },
            'set': function (value) {
                ID = value;
            }
        });
    
        var host;
        this.url = function (callback) {
    
            if (!this.ID) {
                callback();
                return;
            }
    
            if (host) {
                callback(host + '&draft_file_id=' + this.ID);
                return;
            }
    
            var token = auth.sessions[graph.session].token;
            var params = {'token': token};
            var self = this;
            module.execute('picture/host/draft', params, function (response) {
    
                host = response.url;
                callback(host + '&draft_file_id=' + ID);
    
            });
    
        };
    
        Object.defineProperty(this, 'unsaved', {
            'get': function () {
                if (stored === picture.UNKNOWN) return picture.UNKNOWN;
                return stored !== ID;
            }
        });
    
        this.set = function (state, value) {
            if (state === 'stored') stored = value;
        };
    
        this.clean = function () {
            stored = picture.EMPTY;
            ID = picture.EMPTY;
        };
    
    };
    
    
    /************************************
     FILE NAME: graph/picture/external.js
     ************************************/
    
    var External = function (picture) {
        "use strict";
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        var stored = picture.UNKNOWN;
    
        var timer;
        var ograph;
        var check = function () {
    
            clearTimeout(timer);
            timer = setTimeout(function () {
    
                if (ograph && ograph.url === url) return;
                if (url === picture.EMPTY) return;
    
                if (!/^(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?/.test(url)) {
                    events.trigger('check', false);
                    return;
                }
    
                var params = {'url': url};
                module.execute('picture/external/valid', params, function (response) {
    
                    if (params.url !== url) return;
    
                    ograph = response;
                    events.trigger('check', ograph.valid, ograph.image);
                    if (response.valid) events.trigger('change');
    
                });
    
            }, 500);
    
        };
    
    
        var url = picture.EMPTY;
        Object.defineProperty(this, 'url', {
            'get': function () {
    
                if (url !== picture.EMPTY) return url;
    
                if (stored === picture.UNKNOWN) return picture.UNKNOWN;
    
                if (stored !== picture.EMPTY) return stored;
    
                return picture.EMPTY;
    
            },
            'set': function (value) {
                url = value;
                check();
            }
        });
    
        Object.defineProperty(this, 'unsaved', {
            'get': function () {
                if (stored === picture.UNKNOWN) return picture.UNKNOWN;
                return stored !== url;
            }
        });
    
        this.set = function (state, value) {
            if (state === 'stored') stored = value;
        };
    
        this.clean = function () {
            stored = picture.EMPTY;
            url = picture.EMPTY;
        };
    
    };
    
    
    /********************************
     FILE NAME: graph/picture/host.js
     ********************************/
    
    var Host = function () {
        "use strict";
    
        var loaded;
    
        var url;
        Object.defineProperty(this, 'url', {
            'get': function () {
                return url;
            }
        });
    
        Object.defineProperty(this, 'ready', {
            'get': function () {
                return loaded;
            }
        });
    
        module.execute('picture/host/published', function (response, error) {
    
            if (error) {
                console.log(error.message);
                return;
            }
    
            loaded = true;
            url = response;
    
        });
    
    };
    
    var host = new Host();
    var PictureHost = function () {
        "use strict";
    
        Object.defineProperty(this, 'ready', {
            'get': function () {
                return host.ready;
            }
        });
    
        Object.defineProperty(this, 'url', {
            'get': function () {
                if (host.ready) return host.url;
            }
        });
    
    };
    
    
    /***********************************
     FILE NAME: graph/picture/picture.js
     ***********************************/
    
    var GraphPicture = function (graph) {
        "use strict";
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        var EMPTY = graph.EMPTY;
        Object.defineProperty(this, 'EMPTY', {
            'get': function () {
                return EMPTY;
            }
        });
    
        var UNKNOWN = graph.UNKNOWN;
        Object.defineProperty(this, 'UNKNOWN', {
            'get': function () {
                return UNKNOWN;
            }
        });
    
        var temp = new Temp(this, graph);
        Object.defineProperty(this, 'temp', {
            'get': function () {
                return temp;
            }
        });
    
        var external = new External(this);
        Object.defineProperty(this, 'external', {
            'get': function () {
                return external;
            }
        });
    
        external.bind('change', function () {
            temp.ID = EMPTY;
            events.trigger('change');
        });
    
        var uploader = new GraphPictureUploader(graph);
        this.upload = function (file, replace) {
            external.url = EMPTY;
            uploader.upload(file, replace);
        };
    
        this.abortUpload = function () {
            uploader.abort();
        };
    
        Object.defineProperty(this, 'uploading', {
            'get': function () {
                return uploader.uploading;
            }
        });
    
        uploader.bind('progress', function (porcent) {
            events.trigger('progress', porcent);
        });
    
        uploader.bind('complete', function () {
    
            temp.ID = uploader.ID;
    
            events.trigger('complete');
            events.trigger('change');
    
        });
    
        uploader.bind('error', function (event) {
            events.trigger('error', event);
        });
    
        uploader.bind('abort', function () {
            events.trigger('abort');
        });
    
        var stored = UNKNOWN;
        Object.defineProperty(this, 'stored', {
            'get': function () {
                return stored;
            }
        });
    
        var published = UNKNOWN;
        Object.defineProperty(this, 'published', {
            'get': function () {
                return published;
            }
        });
    
        Object.defineProperty(this, 'unsaved', {
            'get': function () {
    
                if (temp.unsaved === UNKNOWN || external.unsaved === UNKNOWN) return UNKNOWN;
                return temp.unsaved || external.unsaved;
    
            }
        });
    
        Object.defineProperty(this, 'edited', {
            'get': function () {
    
                return temp.ID !== EMPTY || external.url !== EMPTY;
    
            }
        });
    
        this.set = function (state, value) {
    
            switch (state) {
    
                case 'stored':
    
                    temp.set('stored', EMPTY);
                    external.set('stored', EMPTY);
    
                    if (value && value.external) external.url = value.external;
                    else if (value && typeof value.temp === 'number') temp.ID = value.temp;
    
                    break;
    
                case 'published':
    
                    published = value;
                    break;
    
            }
    
        };
    
        Object.defineProperty(this, 'JSON', {
            'get': function () {
                return published;
            }
        });
    
        var host = new PictureHost();
        this.dump = function () {
    
            temp.clean();
            external.clean();
    
            if (published === EMPTY || published === UNKNOWN) {
    
                if (!host.ready) {
                    published === UNKNOWN;
                    return;
                }
    
                var session = auth.sessions[graph.session];
                if (!session.valid) return;
    
                var url = host.url;
                url += '?graphId=' + graph.ID + '&ds_id=' + session.ds.ID;
    
                published = url;
    
            }
    
        };
    
    };
    
    
    /************************************
     FILE NAME: graph/picture/uploader.js
     ************************************/
    
    var url;
    var GraphPictureUploader = function (graph) {
        "use strict";
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
    
        var ID;
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            }
        });
    
        var url;
        var xhr;
    
        var progress = function (event) {
            var percent = Math.round(event.loaded * 100 / event.total);
            percent = parseInt(percent);
            events.trigger('progress', percent);
        };
    
        var complete = function () {
            events.trigger('complete');
            uploading = false;
        };
    
        var error = function (event) {
            events.trigger('error', event);
            uploading = false;
        };
    
        var abort = function (event) {
            events.trigger('abort', event);
            uploading = false;
        };
    
        var uploading;
        Object.defineProperty(this, 'uploading', {
            'get': function () {
                return uploading;
            }
        });
    
        var upload = function (file, url) {
    
            if (uploading) {
                console.warn('a previous file is being uploaded');
                return;
            }
    
            uploading = true;
    
            var reader = new FileReader();
    
            // on load file
            reader.onload = function (event) {
    
                // upload the file
                var fd = new FormData();
                fd.append("file", file);
    
                xhr = new XMLHttpRequest();
    
                /* event listeners */
                xhr.upload.addEventListener('progress', progress, false);
                xhr.addEventListener('load', complete, false);
                xhr.addEventListener('error', error, false);
                xhr.addEventListener('abort', abort, false);
                /* send form data */
    
                xhr.open('POST', url);
                xhr.send(fd);
    
            };
    
            // on error loading file
            reader.onerror = function (event) {
                events.trigger('error', event);
            };
    
            // load the file from disk
            reader.readAsDataURL(file);
    
        };
    
        this.upload = function (file, replace) {
    
            if (!replace && !ID) ID = Date.now();
    
            if (url) {
    
                var address = url;
                if (!replace) address += '&draftFileId=' + ID;
                upload(file, address);
                return;
    
            }
    
            var token = auth.sessions[graph.session].token;
            var params = {'token': token};
            if (!replace) params.draft = true;
            else params.graphID = graph.ID;
    
            module.execute('picture/host/upload', params, function (response) {
    
                url = response.url;
    
                var address = url;
                if (!replace) address += '&draftFileId=' + ID;
                upload(file, address);
    
            });
    
        };
    
        this.abort = function () {
            xhr.abort();
        };
    
    };
    
    
    /*************************
     FILE NAME: graph/owner.js
     *************************/
    
    var GraphOwner = function (data) {
        "use strict";
    
        if (typeof data !== 'object' || !data.owner) return;
    
        var ID;
        if (typeof data.owner === 'string') {
            ID = data.owner;
            return;
        }
        else {
            ID = data.owner.ID;
        }
    
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            }
        });
    
        // set graph attributes
        var attributes = data.owner.attributes;
        this.attributes = {};
        this.attributes.created = attributes.created;
        this.attributes.enabled = attributes.enabled;
        this.attributes.authorized = attributes.authorized;
        this.attributes.picture = attributes.picture;
        this.attributes.url = attributes.url;
    
        // define document properties
        var document = data.owner.document;
        this.document = {};
        this.document.about = document.about;
        this.document.birthday = document.birthday;
        this.document.name = document.name;
        this.document.lastName = document.lastName;
        this.document.email = document.email;
    
        Object.defineProperty(this, 'picture', {
            'get': function () {
                return data.owner.picture;
            }
        });
    
        Object.defineProperty(this, 'JSON', {
            'get': function () {
    
                if (!ID) return;
    
                var JSON = {
                    'ID': ID
                };
    
                JSON.attributes = {};
                $.extend(JSON.attributes, attributes);
    
                JSON.document = {};
                $.extend(JSON.document, document);
    
                JSON.picture = this.picture;
    
                return JSON;
    
            }
        });
    
    };
    
    
    /***************************
     FILE NAME: graph/changes.js
     ***************************/
    
    var GraphChanges = function (graph) {
        "use strict";
    
        var proto = Object.create(GraphChanges.prototype);
    
        Object.defineProperty(this, 'graph', {
            'get': function () {
                return graph;
            }
        });
    
        Object.defineProperty(this, 'edited', {
            'configurable': true,
            'get': function () {
                return proto.edited.call(this);
            }
        });
    
    };
    
    GraphChanges.prototype.edited = function () {
        "use strict";
    
        var JSON = {};
        var attributes = this.graph.attributes.changes.edited;
        var document = this.graph.document.changes.edited;
    
        if (attributes) JSON.attributes = attributes;
        if (document) JSON.document = document;
    
        var containers = this.graph.containers;
        if (containers && containers.edited) {
            JSON.containers = containers.value;
        }
    
        var picture = this.graph.picture;
        if (picture.edited) {
            JSON.picture = {};
            if (picture.temp.ID !== picture.EMPTY && picture.temp.ID !== picture.UNKNOWN)
                JSON.picture.temp = picture.temp.ID;
            else if (picture.external.url !== picture.EMPTY && picture.external.url !== picture.UNKNOWN)
                JSON.picture.external = picture.external.url;
        }
    
        return JSON;
    
    };
    
    
    /***************************
     FILE NAME: graph/version.js
     ***************************/
    
    var GraphVersion = function (graph, events) {
        "use strict";
    
        var ID;
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            },
            'set': function (value) {
                ID = value;
            }
        });
    
    
        Object.defineProperty(this, 'JSON', {
            'get': function () {
    
                if (!ID) return;
    
                var JSON = {};
                JSON.ID = ID;
    
                return JSON;
    
            }
        });
    
    };
    
    
    /**************************
     FILE NAME: graph/entity.js
     **************************/
    
    var Entity = function () {
        "use strict";
    
        var ID;
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            },
            'set': function (value) {
                ID = value;
            }
        });
    
        Object.defineProperty(this, 'JSON', {
            'get': function () {
                return {
                    'ID': ID
                };
            }
        });
    
    };
    
    
    /******************************
     FILE NAME: graph/containers.js
     ******************************/
    
    var GraphContainers = function (child) {
        "use strict";
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        var UNKNOWN = child.UNKNOWN;
        Object.defineProperty(this, 'UNKNOWN', {
            'get': function () {
                return UNKNOWN;
            }
        });
    
        var EMPTY = child.EMPTY;
        Object.defineProperty(this, 'EMPTY', {
            'get': function () {
                return EMPTY;
            }
        });
    
        var Item;
        Object.defineProperty(this, 'Item', {
            'get': function () {
                return Item;
            },
            'set': function (value) {
    
                if (typeof value !== 'function') {
                    console.error('invalid Item definition, it must be a function');
                    return;
                }
    
                Item = value;
    
            }
        });
    
        // The container can wrap only the container ID, or the graph of the container
        // The graph can be set only when the container is restored
        // When the graph is created as a new object, here the container
        // will manage the container ID, not the graph of the container
        var graph;
        Object.defineProperty(this, 'graph', {
            'get': function () {
                return graph;
            }
        });
    
        var value = EMPTY;
        Object.defineProperty(this, 'value', {
            'get': function () {
    
                if (graph) {
                    return graph.ID;
                }
    
                if (value !== EMPTY) {
                    return value;
                }
    
                if (stored !== EMPTY && stored !== UNKNOWN) {
                    return stored;
                }
    
                return published;
    
            },
            'set': function (_value) {
    
                if (value === _value) return;
    
                if (graph) {
                    console.error('Actually we do not support to change the container of the graph');
                    return;
                }
    
                value = _value;
                events.trigger('change', value);
    
            }
        });
    
        var stored = UNKNOWN;
        Object.defineProperty(this, 'stored', {
            'get': function () {
                return stored;
            }
        });
    
        var published = UNKNOWN;
        Object.defineProperty(this, 'published', {
            'get': function () {
                return published;
            }
        });
    
        Object.defineProperty(this, 'unsaved', {
            'get': function () {
    
                if (stored === UNKNOWN) return UNKNOWN;
                return value !== stored;
    
            }
        });
    
        Object.defineProperty(this, 'edited', {
            'get': function () {
    
                if (published === UNKNOWN) return UNKNOWN;
                return published !== this.value;
    
            }
        });
    
        this.set = function (state, data) {
    
            if (typeof data === 'undefined') data = EMPTY;
    
            if (state === 'published') {
    
                // actually we are supporting only one container
                if (data instanceof Array) data = data[0];
                if (typeof data === 'string' || data === EMPTY) published = data;
    
            }
            else if (state === 'stored') {
    
                if (typeof data === 'string' || data === EMPTY) stored = data;
    
            }
    
            if (state === 'published' && typeof data === 'object' && data !== EMPTY) {
    
                if (typeof this.Item === 'function') {
                    graph = this.Item({'published': data});
                }
    
            }
    
        };
    
        Object.defineProperty(this, 'JSON', {
            'get': function () {
    
                if (graph) {
                    return [graph.JSON];
                }
    
            }
        });
    
        this.dump = function () {
    
            if (value !== EMPTY) published = value;
            value = EMPTY;
    
        };
    
    };
    
    
    /***********************************
     FILE NAME: graph/drafts/my-draft.js
     ***********************************/
    
    var MyDraft = function (ID, graph, events) {
        "use strict";
    
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            }
        });
    
        var saving, saveAgain;
        var save = function (collectionID, callback) {
    
            // if graph is being saved, just wait to finish the actual saving,
            // and save again after that
            if (saving) {
                saveAgain = true;
                return;
            }
    
            saving = true;
            saveAgain = false;
            events.trigger('saving');
    
            require(['code/apps/drafts/client/module'], function (o) {
    
                var data = graph.changes.edited;
    
                if (!graph.ID) data.entity = graph.entity.JSON;
    
                o.saveDraft(collectionID, ID, data, function (_ID) {
    
                    ID = _ID;
                    if (saveAgain) {
                        save(collectionID, callback);
                        return;
                    }
    
                    graph.set({
                        'stored': data
                    });
    
                    saving = false;
                    events.trigger('saved');
                    if (callback) callback();
    
                });
    
            });
    
        };
    
        graph.save = function (collectionID, callback) {
            save(collectionID, callback);
        };
    
        var loading, loaded;
        graph.load = function (collectionID, callback) {
    
            if (!ID) {
                console.error('impossible to load a graph without its draft ID');
                return;
            }
    
            if (loaded) {
                return;
            }
    
            loading = true;
            events.trigger('loading');
    
            require(['code/apps/drafts/client/module'], function (o) {
    
                o.loadDraft(collectionID, ID, function (draft) {
    
                    loaded = true;
                    loading = false;
    
                    if (typeof draft === 'object' && typeof draft.data === 'object') {
                        graph.set({
                            'stored': draft.data
                        });
                    }
    
                    if (callback) callback();
                    events.trigger('loaded');
    
                });
    
            });
    
        };
    
        var discarding;
        graph.discard = function (collectionID, callback) {
    
            if (!ID) {
                console.error('impossible to remove a draft without its draft ID');
                return;
            }
    
            discarding = true;
            events.trigger('discarding');
    
            require(['code/apps/drafts/client/module'], function (o) {
    
                o.removeDraft(collectionID, ID, function () {
    
                    discarding = false;
                    ID = undefined;
                    graph.blank('stored');
                    graph.blank('memory');
    
                    if (callback) callback();
                    events.trigger('discarded');
    
                });
    
            });
    
        };
    
        this.clean = function () {
    
            ID = undefined;
            graph.blank('stored');
            graph.blank('memory');
    
            events.trigger('discarded');
    
        };
    
        // expose saving property
        Object.defineProperty(this, 'saving', {
            'get': function () {
                return saving;
            }
        });
    
        // expose loaded property
        Object.defineProperty(this, 'loaded', {
            'get': function () {
                return loaded;
            }
        });
    
        // expose loading property
        Object.defineProperty(this, 'loading', {
            'get': function () {
                return loading;
            }
        });
    
        // expose discarding property
        Object.defineProperty(this, 'discarding', {
            'get': function () {
                return discarding;
            }
        });
    };
    
    
    /*********************************
     FILE NAME: graph/drafts/drafts.js
     *********************************/
    
    var GraphDrafts = function (graph, events) {
        "use strict";
    
        var drafts;
        Object.defineProperty(this, 'drafts', {
            'get': function () {
                return drafts;
            }
        });
    
        // is this graph being edited by others?
        Object.defineProperty(graph, 'editedByOthers', {
            'get': function () {
    
                var userID = auth.sessions.community.user.ID;
                for (var ownerID in drafts) {
                    if (userID !== ownerID) {
                        return true;
                    }
                }
    
                return false;
    
            }
        });
    
        var mine = new MyDraft(undefined, graph, events);
        Object.defineProperty(this, 'mine', {
            'get': function () {
                return mine;
            }
        });
    
        this.set = function (data) {
    
            if (!auth.sessions.community.valid) return;
    
            if (typeof data !== 'object') data = {};
    
            if (data.published && data.published.drafts) {
    
                drafts = data.published.drafts;
    
                var userID = auth.sessions.community.account.user.ID;
                var mineID = drafts[userID];
                if (mineID) {
                    mine = new MyDraft(mineID, graph, events);
                }
    
            }
            else if (data.stored && data.stored.draft) {
                mine = new MyDraft(data.stored.draft, graph, events);
            }
    
        };
    
        Object.defineProperty(graph, 'saving', {
            'get': function () {
                return mine.saving;
            }
        });
    
        Object.defineProperty(graph, 'loaded', {
            'get': function () {
                return mine.loaded;
            }
        });
    
        Object.defineProperty(graph, 'loading', {
            'get': function () {
                return mine.loading;
            }
        });
    
    };
    
    
    /*************************
     FILE NAME: graph/fetch.js
     *************************/
    
    var GraphFetch = function (graph, events) {
        "use strict";
    
        var fetched;
        Object.defineProperty(graph, 'fetched', {
            'get': function () {
                return fetched;
            }
        });
    
        var fetching = false;
        Object.defineProperty(graph, 'fetching', {
            'get': function () {
                return fetching;
            }
        });
    
        graph.fetch = function () {
    
            var options, callback;
            if (arguments.length > 2) {
                console.error('invalid arguments', arguments);
                return;
            }
    
            for (var i in arguments) {
                if (typeof arguments[i] === 'function') callback = arguments[i];
                else options = arguments[i];
            }
    
            if (fetching || fetched) {
                console.warn('graph is being fetched or it was already fetched');
                if (callback) callback();
                return;
            }
            fetching = true;
            events.trigger('fetching');
    
            if (!options) options = {};
    
            var module = graph.api.module;
            var path = '';
            if (graph.api.path) path = graph.api.path + '/';
    
            var params = {};
            params.token = auth.sessions[graph.session].token;
    
            if (graph.ID) params.ID = graph.ID;
    
            if (options.params) {
                $.extend(params, options.params);
            }
    
            module.execute(path + 'get', params, function (response) {
    
                var data = response.data;
                if (data.length > 1) {
                    layout.messages.push('unexpected error', 'Error: Some data that was received is invalid.', 'error');
                    console.error('zero or one record was expected', response);
                    return;
                }
    
                if (data.length) {
    
                    graph.set({
                        'published': data[0]
                    });
    
                }
    
                fetching = false;
                fetched = true;
                events.trigger('fetched');
                if (callback) callback();
    
            });
        };
    
    };
    
    
    /***************************
     FILE NAME: graph/publish.js
     ***************************/
    
    var GraphPublish = function (graph, events) {
        "use strict";
    
        var publishing = false;
        Object.defineProperty(graph, 'publishing', {
            'get': function () {
                return publishing;
            }
        });
    
        graph.publish = function (callback) {
    
            if (!graph.edited) {
                if (callback) callback();
                return;
            }
    
            var module = graph.api.module;
            var path = '';
            if (graph.api.path) path = graph.api.path + '/';
    
            var params = graph.changes.edited;
            params.token = auth.sessions[graph.session].token;
    
            if (graph.ID) {
                params.ID = graph.ID;
                params.versionID = graph.version.ID;
            }
    
            if (graph.drafts.mine.ID) {
                params.draft = {};
                params.draft.ID = graph.drafts.mine.ID;
    
                if (graph.ID)
                    params.draft.collectionID = graph.ID;
                else
                    params.draft.collectionID = 'F00000000000000000000001';
            }
    
            publishing = true;
            events.trigger('publishing');
    
            module.execute(path + 'publish', params, function (response) {
    
                if (!graph.ID) {
    
                    graph.ID = response.data.ID;
                    graph.version.ID = response.data.versionID;
    
                }
    
                graph.dump();
                graph.drafts.mine.clean();
    
                publishing = false;
                events.trigger('published');
                if (callback) callback();
    
            });
    
        };
    
    };
    
    
    /**************************
     FILE NAME: graph/remove.js
     **************************/
    
    var GraphRemove = function (graph, events) {
        "use strict";
    
        var removing = false;
        Object.defineProperty(this, 'removing', {
            'get': function () {
                return removing;
            }
        });
    
        var removed = false;
        Object.defineProperty(this, 'removed', {
            'get': function () {
                return removed;
            }
        });
    
        graph.remove = function (callback) {
    
            if (!graph.ID) return;
    
            removing = true;
            events.trigger('removing');
    
            var module = graph.api.module;
            var path = '';
            if (graph.api.path) path = graph.api.path + '/';
    
            var params = {};
            params.token = auth.sessions[graph.session].token;
    
            params.ID = graph.ID;
            params.versionID = graph.version.ID;
    
            module.execute(path + 'remove', params, function (response) {
    
                removed = true;
                events.trigger('removed');
                if (typeof callback === 'function') callback();
    
            });
    
        };
    
    };
    
    
    /*************************
     FILE NAME: graph/graph.js
     *************************/
    
    var instances = 0;
    var Graph = function (api, params) {
        "use strict";
    
        instances++;
        var instance = instances;
        Object.defineProperty(this, 'instance', {
            'get': function () {
                return instance;
            }
        });
    
        Object.defineProperty(this, 'api', {
            'get': function () {
    
                return {
                    'module': api.module,
                    'path': api.path
                };
    
            }
        });
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        if (!params) params = {};
    
        var session;
        Object.defineProperty(this, 'session', {
            'get': function () {
                if (!session) return 'community';
                return session;
            },
            'set': function (value) {
                if (value !== 'community' && value !== 'vertical') {
                    console.error('invalid token, it must be "community" or "vertical", it was:', value);
                    return;
                }
                session = value;
            }
        });
    
        var UNKNOWN = module.UNKNOWN;
        Object.defineProperty(this, 'UNKNOWN', {
            'get': function () {
                return UNKNOWN;
            }
        });
    
        var EMPTY = module.EMPTY;
        Object.defineProperty(this, 'EMPTY', {
            'get': function () {
                return EMPTY;
            }
        });
    
        this.attributes = new Properties(this, 'attributes');
        this.attributes.bind('change', function (property) {
            events.trigger('change', 'attributes', property);
        });
    
    
        // set graph attributes
        this.attributes.define('created');
        this.attributes.define('updated');
        this.attributes.define('enabled');
        this.attributes.define('authorized');
        this.attributes.define('language');
        this.attributes.define('picture');
        this.attributes.define('url');
    
        this.document = new Properties(this, 'document');
        this.document.bind('change', function (property) {
            events.trigger('change', 'document', property);
        });
    
        this.containers = new GraphContainers(this);
        this.containers.bind('change', Delegate(this, function () {
            events.trigger('change', 'containers', this.containers);
        }));
    
        // Containers can be a graph (actually only supports one container)
        // If not, it handles the container ID as the properties does (value, stored and persisted)
        Object.defineProperty(this, 'parents', {
            'get': function () {
                if (this.containers.graph) {
                    return this.containers.graph;
                }
    
                return this.containers.value;
            }
        });
    
        // Returns the first container
        Object.defineProperty(this, 'container', {
            'get': function () {
                return this.containers.graph;
            }
        });
    
        // this property is set on the 'set' method
        this.published;
    
        this.picture = new GraphPicture(this);
        this.picture.bind('change', function () {
            events.trigger('change');
        });
    
        this.entity = new Entity();
        this.drafts = new GraphDrafts(this, events);
        this.version = new GraphVersion(this, events);
    
        this.changes = new GraphChanges(this);
    
        var fetch = new GraphFetch(this, events);
        var publish = new GraphPublish(this, events);
        var remove = new GraphRemove(this, events);
    
    
        var ID;
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            },
            'set': function (value) {
                ID = value;
            }
        });
        if (params.ID) ID = params.ID;
    
        Object.defineProperty(this, 'persisted', {
            'get': function () {
                return typeof ID === 'string';
            }
        });
    
        Object.defineProperty(this, 'unsaved', {
            'configurable': true,
            'get': function () {
    
                if (this.attributes.unsaved === UNKNOWN ||
                    this.document.unsaved === UNKNOWN) {
    
                    return UNKNOWN;
                }
    
                if (this.attributes.unsaved || this.document.unsaved ||
                    this.containers.unsaved || this.picture.unsaved) {
    
                    return true;
                }
    
                return false;
    
            }
        });
    
        Object.defineProperty(this, 'edited', {
            'get': function () {
    
                if (this.attributes.edited === UNKNOWN ||
                    this.document.edited === UNKNOWN ||
                    this.picture.edited === UNKNOWN) {
    
                    return UNKNOWN;
                }
    
                if (this.attributes.edited ||
                    this.document.edited ||
                    this.picture.edited ||
                    this.containers.edited) {
    
                    return true;
                }
    
                return false;
    
            }
        });
    
        this.dump = function () {
    
            this.attributes.dump();
            this.document.dump();
            this.containers.dump();
            this.picture.dump();
    
        };
    
    
        // overwritable functions
        var graph = Object.create(Graph.prototype);
        this.set = graph.set;
        this.blank = graph.blank;
    
        Object.defineProperty(this, 'JSON', {
            'configurable': true,
            'get': function () {
                return graph.JSON.call(this);
            }
        });
    
        return {
            'events': events
        };
    
    };
    
    Graph.prototype.set = function (data) {
        "use strict";
    
        if (typeof data !== 'object') data = {};
    
        if (data.published) {
            this.ID = data.published.ID;
            if (data.published.version) this.version.ID = data.published.version.ID;
        }
        if (!data.published && !this.ID) this.blank('published');
    
        var self = this;
        var set = function (state, data) {
    
            if (typeof data[state] === 'object' && data[state] !== null) {
    
                if (typeof data[state].attributes === 'object') {
                    self.attributes.set(state, data[state].attributes);
                }
    
                if (typeof data[state].document === 'object') {
                    self.document.set(state, data[state].document);
                }
    
            }
    
        };
    
        set('stored', data);
        set('published', data);
    
        if (data.stored) {
    
            this.containers.set('stored', data.stored.containers);
            this.picture.set('stored', data.stored.picture);
    
        }
    
        // drafts
        this.drafts.set(data);
        if (!this.drafts.mine.ID) this.blank('stored');
    
        if (data.published) {
    
            // set the containers
            this.containers.set('published', data.published.containers);
    
            // picture and owner
            this.picture.set('published', data.published.picture);
            this.owner = new GraphOwner(data.published);
    
            // expose this.published
            this.published = data.published;
    
            var community = data.published.community;
            if (community) this.community = community;
    
        }
    
    };
    
    Graph.prototype.JSON = function () {
        "use strict";
    
        var json = {'ID': this.ID};
        json.version = this.version.JSON;
        json.entity = this.entity.JSON;
        json.attributes = this.attributes.JSON;
        json.document = this.document.JSON;
    
        json.containers = this.containers.JSON;
    
        // we are actually supporting only one container
        if (json.containers && json.containers.length) json.container = json.containers[0];
    
        json.picture = this.picture.JSON;
    
        if (this.owner) json.owner = this.owner.JSON;
    
        json.created = friendlyTime(json.attributes.created);
        json.updated = friendlyTime(json.attributes.updated);
    
        if (this.community) json.community = this.community;
    
        return json;
    
    };
    
    Graph.prototype.blank = function (state) {
        "use strict";
    
        var EMPTY = module.EMPTY;
        var name;
        var attributes = {};
        for (name in this.attributes.iterator) attributes[name] = EMPTY;
    
        var document = {};
        for (name in this.document.iterator) document[name] = EMPTY;
    
        if (state === 'published') {
            this.attributes.set('published', attributes);
            this.document.set('published', document);
            this.containers.set('published', EMPTY);
            this.picture.set('published', EMPTY);
        }
        else if (state === 'stored') {
            this.attributes.set('stored', attributes);
            this.document.set('stored', document);
            this.containers.set('stored', EMPTY);
            this.picture.set('stored', EMPTY);
        }
        else if (state === 'memory') {
            this.attributes.set('memory', attributes);
            this.document.set('memory', document);
            this.containers.set('memory', EMPTY);
            this.picture.set('memory', EMPTY);
        }
    
    };
    
    
    /***************************************
     FILE NAME: contributors/contributors.js
     ***************************************/
    
    var Contributors = function (graph) {
        "use strict";
    
        this.attributes = {};
        var contributors;
        Object.defineProperty(this, 'objects', {
            'get': function () {
                return contributors;
            }
        });
    
        this.fetch = function (callback) {
    
            var params = {};
            $.extend(params, this.attributes);
            params.graphID = graph.ID;
            params.entityID = graph.entity.ID;
    
            module.execute('contributors/get', params, function (response) {
    
                // create the graphs
                var direct = response.data.direct;
                var inherited = response.data.inherited;
    
                var i;
    
                var setGraph = function (contributors, role) {
    
                    for (i in contributors[role]) {
    
                        var contributor = contributors[role][i];
                        contributor = new User({
                            'published': contributor
                        });
    
                        contributors[role][i] = contributor;
    
                    }
    
                };
    
                // direct contributors
                setGraph(direct, 'admins');
                setGraph(direct, 'publishers');
                setGraph(direct, 'contributors');
    
                // inherited contributors
                setGraph(inherited, 'admins');
                setGraph(inherited, 'publishers');
                setGraph(inherited, 'contributors');
    
    
                contributors = {
                    'direct': direct,
                    'inherited': inherited
                };
    
                if (typeof callback === 'function') callback(contributors);
    
            });
    
        };
    
        // remove a previous permission if the user already has it
        this.remove = function (user) {
    
            var remove = function (role) {
    
                var permissions = contributors.direct[role];
                for (var i = permissions.length - 1; i >= 0; i--) {
                    if (user.ID === permissions[i].ID) {
                        delete permissions[i];
                        permissions.splice(i, 1);
                    }
                }
    
            };
            remove('admins');
            remove('publishers');
            remove('contributors');
    
        };
    
        this.push = function (role, user) {
    
            this.remove(user);
    
            switch (role) {
    
                case 'administrator':
                    contributors.direct.admins.push(user);
                    break;
    
                case 'publisher':
                    contributors.direct.publishers.push(user);
                    break;
    
                case 'contributor':
                    contributors.direct.contributors.push(user);
                    break;
    
            }
    
        };
    
        this.update = function (callback) {
    
            // create lists with only the users IDs
            var params = {};
            params.admins = [];
            params.publishers = [];
            params.contributors = [];
    
            var i;
            for (i in contributors.direct.admins)
                params.admins.push(contributors.direct.admins[i].ID);
            for (i in contributors.direct.publishers)
                params.publishers.push(contributors.direct.publishers[i].ID);
            for (i in contributors.direct.contributors)
                params.contributors.push(contributors.direct.contributors[i].ID);
    
            if (params.admins.length) params.admins = params.admins.join(',');
            else delete params.admins;
    
            if (params.publishers.length) params.publishers = params.publishers.join(',');
            else delete params.publishers;
    
            if (params.contributors.length) params.contributors = params.contributors.join(',');
            else delete params.contributors;
    
            params.token = auth.sessions[graph.session].token;
    
            // used to know what is the application to be invoked (required to set the access secret key)
            params.graphID = graph.ID;
            params.entityID = graph.entity.ID;
    
    
            module.execute('contributors/set', params, function (response) {
                if (callback) callback();
            });
    
        };
    
    };
    
    
    /***********************************
     FILE NAME: communities/community.js
     ***********************************/
    
    var Community = function (params) {
        "use strict";
    
        var api = {'module': module, 'path': 'communities'};
    
        var graph = Object.create(Graph.prototype);
        var output = Graph.call(this, api, params);
        var events = output.events;
    
        this.entity.ID = '1';
    
        // define document properties
        this.document.define('name');
        this.document.define('category');
        this.document.define('description');
    
        this.contributors = new Contributors(this);
    
        var dsName;
        Object.defineProperty(this, 'dsName', {
            'get': function () {
                return dsName;
            }
        });
    
        var amIMember;
        Object.defineProperty(this, 'amIMember', {
            'get': function () {
                return amIMember;
            },
            'set': function (value) {
                if (!value) return;
    
                amIMember = value;
                events.trigger('register');
            }
        });
    
        this.set = function (params) {
    
            graph.set.call(this, params);
            if (params && params.published) {
                dsName = params.published.dsName;
                amIMember = params.published.amIMember;
            }
    
        };
    
        this.set(params);
    
    };
    
    
    /**********************************
     FILE NAME: users/user/followers.js
     **********************************/
    
    var Followers = function (userID) {
        "use strict";
    
        var api = {'module': module, 'path': 'contacts'};
        Collection.call(this, api);
    
        this.attributes.to = userID;
    
        this.Item = function (data) {
    
            var following = data;
            following.from = new User({'published': data.from});
    
            return following;
    
        };
    
    };
    
    
    /****************************************
     FILE NAME: users/user/following/users.js
     ****************************************/
    
    var FollowingUsers = function (userID) {
        "use strict";
    
        var api = {'module': module, 'path': 'contacts'};
        Collection.call(this, api);
    
        this.attributes.from = userID;
    
        this.Item = function (data) {
    
            var following = data;
            following.to = new User({'published': data.to});
    
            return following;
    
        };
    
    };
    
    
    /*****************************************
     FILE NAME: users/user/following/topics.js
     *****************************************/
    
    var FollowingTopics = function (userID) {
        "use strict";
    
    };
    
    
    /***********************************
     FILE NAME: users/user/roles/role.js
     ***********************************/
    
    var Role = function (data, dependencies) {
        "use strict";
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        var contents;
        if (dependencies) contents = dependencies[0];
    
        var Graph;
        switch (data.asset.entity.ID) {
            case '1':
                Graph = Community;
                break;
            case '3':
                Graph = contents.Topic;
                break;
            case '5':
                Graph = contents.Section;
                break;
            default:
                console.error('asset not recognized on role', role);
                return;
        }
    
        var graph = new Graph({
            'published': data.asset
        });
        Object.defineProperty(this, 'graph', {
            'get': function () {
                return graph;
            }
        });
    
        var onRemoved = function () {
            events.trigger('removed');
        };
    
        var onChange = function () {
            events.trigger('change');
        };
    
        graph.bind('removed', onRemoved);
        graph.bind('change', onChange);
    
        Object.defineProperty(this, 'permission', {
            'get': function () {
                return data.permission;
            }
        });
    
    };
    
    
    /*********************************
     FILE NAME: users/user/roles/ds.js
     *********************************/
    
    var DSRole = function (userID) {
        "use strict";
    
        var events = new Events();
        this.bind = function (event, listener) {
            events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            events.unbind(event, listener);
        };
    
        var token;
        Object.defineProperty(this, 'token', {
            'get': function () {
                return token;
            },
            'set': function (value) {
                token = value;
            }
        });
    
        var role;
        Object.defineProperty(this, 'role', {
            'get': function () {
                return role;
            }
        });
    
        var fetching, fetched;
        Object.defineProperty(this, 'fetching', {
            'get': function () {
                return fetching;
            }
        });
        Object.defineProperty(this, 'fetched', {
            'get': function () {
                return fetched;
            }
        });
    
        var callbacks = [];
    
        this.fetch = function (callback) {
    
            fetched = false;
    
            if (fetching) {
                if (callback) callbacks.push(callback);
                return;
            }
    
            fetching = true;
    
            var params = {
                'entityID': 1,
                'userID': userID
            };
            if (token) params.token = token;
    
            var cache = {
                'read': false,
                'write': false
            };
    
            module.execute('users/roles/get', params, function (response) {
    
                fetching = false;
                fetched = true;
    
                if (response.data instanceof Array && response.data.length)
                    role = new Role(response.data[0]);
    
                events.trigger('fetched', role);
                if (callback) callback(role);
    
                for (var i in callbacks) callbacks[i](role);
                callbacks = [];
    
            }, {'cache': cache});
    
        };
    
    };
    
    
    /************************************
     FILE NAME: users/user/roles/roles.js
     ************************************/
    
    var UserRoles = function (userID) {
        "use strict";
    
        this.ds = new DSRole(userID);
        this.vertical = new DSRole(userID);
    
        var api = {'module': module, 'path': 'users/roles'};
    
        var sections = new Collection(api);
        sections.attributes.entityID = 5;
        sections.attributes.userID = userID;
        Object.defineProperty(this, 'sections', {
            'get': function () {
                return sections;
            }
        });
    
        sections.dependencies = ['libraries/contents/assets'];
        sections.Item = function (data, dependencies) {
            var role = new Role(data, dependencies);
            return role;
        };
    
    
        var topics = new Collection(api);
        topics.attributes.entityID = 3;
        topics.attributes.userID = userID;
        Object.defineProperty(this, 'topics', {
            'get': function () {
                return topics;
            }
        });
    
        topics.dependencies = ['libraries/contents/assets'];
        topics.Item = function (data, dependencies) {
            var role = new Role(data, dependencies);
            return role;
        };
    
    };
    
    
    /*****************************
     FILE NAME: users/user/user.js
     *****************************/
    
    var User = function (params) {
        "use strict";
    
        var api = {'module': module, 'path': 'users'};
    
        var graph = Object.create(Graph.prototype);
        Graph.call(this, api, params);
    
        this.entity.ID = '2';
    
        // define document properties
        this.document.define('about');
        this.document.define('birthday');
        this.document.define('name');
        this.document.define('lastName');
        this.document.define('email');
        this.document.define('country');
    
        this.roles;
        this.following = {
            'users': new FollowingUsers(this.ID),
            'topics': new FollowingTopics(this.ID)
        };
        this.followers = new Followers(this.ID);
    
        this.set = function (params) {
    
            graph.set.call(this, params);
            this.roles = new UserRoles(this.ID);
    
        };
    
        this.set(params);
    
    };
    
    
    /*************************
     FILE NAME: users/users.js
     *************************/
    
    var Users = function () {
        "use strict";
    
        var api = {'module': module, 'path': 'users'};
        Collection.call(this, api);
    
        this.Item = function (data) {
    
            var user = new User({
                'published': data
            });
    
            return user;
    
        };
    
    };
    
    
    /*************************
     FILE NAME: users/me/me.js
     *************************/
    
    // adds .me property to the community and vertical sessions
    // to have one instance of the logged in user
    var me = function (session) {
        "use strict";
    
        var me;
        Object.defineProperty(session, 'me', {
            'get': function () {
                "use strict";
    
                if (!session.valid) return;
    
                if (!me || session.account.user.ID !== me.ID) {
    
                    var userID = session.account.user.ID;
                    me = new User({
                        'ID': userID
                    });
    
                    if (session.name === 'community') me.session = 'community';
                    else me.session = 'vertical';
    
                    me.roles.ds.token = session.token;
                    me.roles.topics.attributes.token = session.token;
                    me.roles.topics.attributes.kind = 'both';
                    me.roles.sections.attributes.token = session.token;
                    me.roles.sections.attributes.kind = 'both';
    
                }
    
                return me;
    
            }
        });
    
        session.bind('change', function () {
            if (!session.valid) me = undefined;
        });
    
    };
    
    me(auth.sessions.community);
    me(auth.sessions.vertical);
    
    
    /********************
     FILE NAME: define.js
     ********************/
    
    define(function () {
        "use strict";
    
        // used to identify unknown values
        // it is just an empty object, which pointer will be used to mean an UNKNOWN value
        module.UNKNOWN = {};
        module.EMPTY = {};
    
        return {
            'Collection': Collection,
            'Graph': Graph,
            'GraphChanges': GraphChanges,
            'Community': Community,
            'User': User,
            'Users': Users,
            'UserRoles': UserRoles,
            'Contributors': Contributors
        };
    
    });
    
    
    
    done('libraries/graphs/model', 'code');

})(beyond.modules.get('libraries/graphs/model'));