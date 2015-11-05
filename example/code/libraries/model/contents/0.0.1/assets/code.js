/*********************
LIBRARY NAME: contents
MODULE: assets
**********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /***************************
     FILE NAME: entries/entry.js
     ***************************/
    
    var Entry = function (api) {
        "use strict";
    
        var Graph = module.model.Graph;
        var graph = Object.create(Graph.prototype);
        Graph.call(this, api);
    
        this.containers.Item = function (data) {
    
            if (!data || (!data.published && !data.stored)) {
                console.error('invalid graph container initialization', data);
                return;
            }
    
            var entity;
            if (data.published) entity = data.published.entity;
            if (!data.published && data.stored) entity = data.stored.entity;
    
            if (!entity) {
                console.error('invalid entity on graph container', data);
                return;
            }
    
            if (entity.ID === '3') {
                return new Topic(data);
            }
            else if (entity.ID === '2') {
                return new module.model.User(data);
            }
    
        };
    
        this.opinions = new Opinions();
    
        Object.defineProperty(this, 'JSON', {
            'get': function () {
    
                var JSON = graph.JSON.call(this);
                if (this.children) JSON.children = this.children.JSON;
                JSON.opinions = this.opinions.JSON;
    
                return JSON;
    
            }
        });
    
        this.set = function (data) {
    
            graph.set.call(this, data);
    
            if (this.children) this.children.set(data);
            this.opinions.set(data);
    
        };
    
    };
    
    
    /***************************************
     FILE NAME: entries/children/pictures.js
     ***************************************/
    
    var Pictures = function () {
        "use strict";
    
    };
    
    
    /***************************************
     FILE NAME: entries/children/ogvideos.js
     ***************************************/
    
    var OGVideos = function () {
        "use strict";
    
    };
    
    
    /**************************************
     FILE NAME: entries/children/article.js
     **************************************/
    
    var ArticleChildren = function (article, children) {
        "use strict";
    
        var pictures = new Pictures({
            'container': article
        });
        Object.defineProperty(this, 'pictures', {
            'get': function () {
                return pictures;
            }
        });
    
        var ogVideos = new OGVideos({
            'container': article
        });
        Object.defineProperty(this, 'ogVideos', {
            'get': function () {
                return ogVideos;
            }
        });
    
        this.set = function (children) {
    
            if (!children) return;
    
            var i;
            for (i in children.pictures) {
                var picture = children.pictures[i];
                picture = new Picture({
                    'published': picture,
                    'container': {
                        'published': article.ID
                    }
                });
    
                pictures.push(picture);
            }
    
            for (i in children.ogVideos) {
                var ogVideo = children.ogVideos[i];
                ogVideo = new OGVideo({
                    'published': ogVideo,
                    'container': {
                        'published': article.ID
                    }
                });
    
                ogVideos.push(ogVideo);
            }
    
        };
    
    
        Object.defineProperty(this, 'unsaved', {
            'get': function () {
                return;
            }
        });
    
    };
    
    
    /***************************************
     FILE NAME: entries/opinions/opinions.js
     ***************************************/
    
    var Opinions = function () {
        "use strict";
    
        var count;
        Object.defineProperty(this, 'count', {
            'get': function () {
                return count;
            }
        });
    
        this.set = function (data) {
            if (data.published && data.published.opinions)
                count = data.published.opinions.count;
        };
    
        Object.defineProperty(this, 'JSON', {
            'get': function () {
                return {
                    'count': count
                };
            }
        });
    
    };
    
    
    /*****************************
     FILE NAME: entries/ogvideo.js
     *****************************/
    
    var OGVideo = function (params) {
        "use strict";
    
        var api = {'module': module, 'path': 'posts/ogVideos'};
    
        var entry = Object.create(Entry.prototype);
        Entry.call(this, api);
    
        this.entity.ID = '14';
    
        // define document properties
        this.document.define('title');
        this.document.define('tags');
        this.document.define('src');
        this.document.define('url');
        this.document.define('description');
    
        this.document.define('og:site');
        this.document.define('og:title');
        this.document.define('og:size');
        this.document.define('og:description');
    
    
        if (!params) params = {};
        this.set(params);
    
    };
    
    
    /*****************************
     FILE NAME: entries/article.js
     *****************************/
    
    var Article = function (params) {
        "use strict";
    
        var api = {'module': module, 'path': 'posts/articles'};
    
        var changes = Object.create(module.model.GraphChanges.prototype);
        var entry = Object.create(Entry.prototype);
        Entry.call(this, api);
    
        this.entity.ID = '4';
    
        // define document properties
        this.document.define('title');
        this.document.define('tags');
        this.document.define('shortDescription');
        this.document.define('description');
    
        var children = new ArticleChildren(this);
        Object.defineProperty(this, 'children', {
            'get': function () {
                return children;
            }
        });
    
        Object.defineProperty(this.changes, 'edited', {
            'get': function () {
    
                var edited = changes.edited.call(this);
                edited.children = children.edited;
                if (!edited.children) delete edited.children;
    
                return edited;
    
            }
        });
    
        if (!params) params = {};
        this.set(params);
    
    };
    
    
    /*****************************
     FILE NAME: entries/gallery.js
     *****************************/
    
    var Gallery = function (params) {
        "use strict";
    
        var api = {'module': module, 'path': 'posts/galleries'};
    
        var entry = Object.create(Entry.prototype);
        Entry.call(this, api);
    
        this.entity.ID = '6';
    
        // define document properties
        this.document.define('title');
        this.document.define('description');
        this.document.define('tags');
    
    
        if (!params) params = {};
        this.set(params);
    
    };
    
    
    /**************************
     FILE NAME: entries/post.js
     **************************/
    
    var Post = function (params) {
        "use strict";
    
        var api = {'module': module, 'path': 'posts/posts'};
    
        var entry = Object.create(Entry.prototype);
        Entry.call(this, api);
    
        this.entity.ID = '23';
    
        // define document properties
        this.document.define('title');
        this.document.define('description');
        this.document.define('tags');
    
    
        if (!params) params = {};
        this.set(params);
    
    };
    
    
    /***************************
     FILE NAME: topics/topics.js
     ***************************/
    
    var Topics = function () {
        "use strict";
    
        var api = {'module': module, 'path': 'topics'};
        var Collection = module.model.Collection;
        Collection.call(this, api);
    
        this.Item = function (data) {
    
            var topic = new Topic({
                'published': data
            });
    
            return topic;
    
        };
    
    };
    
    
    /*******************************
     FILE NAME: topics/interested.js
     *******************************/
    
    var Interested = function (graph) {
        "use strict";
    
        var count, relationID;
        Object.defineProperty(this, 'count', {
            'get': function () {
                return count;
            }
        });
    
        var session = auth.sessions.community;
    
        Object.defineProperty(this, 'relationID', {
            'get': function () {
                if (relationID === '0') return undefined;
                return relationID;
            }
        });
    
        this.set = function (data) {
    
            if (data && data.interested) {
                count = data.interested.count;
                relationID = data.interested.relationID;
            }
    
        };
    
        this.follow = function (callback) {
    
            if (this.relationID) return;
    
            var params = {
                'token': session.token,
                'from': session.account.user.ID,
                'to': graph.ID
            };
    
            module.execute('topic/follow', params, function (response) {
                relationID = response;
                if (callback) callback();
            });
    
        };
    
        this.unfollow = function (callback) {
    
            if (!this.relationID) return;
    
            var params = {
                'token': session.token,
                'relationID': relationID
            };
    
            module.execute('topic/unfollow', params, function () {
                relationID = undefined;
                if (callback) callback();
            });
    
        };
    
    };
    
    
    /**************************
     FILE NAME: topics/topic.js
     **************************/
    
    var Topic = function (params) {
        "use strict";
    
        var api = {'module': module, 'path': 'topics'};
    
        var Graph = module.model.Graph;
        var graph = Object.create(Graph.prototype);
        Graph.call(this, api);
    
        this.entity.ID = '3';
    
        this.document.define('name');
        this.document.define('tags');
        this.document.define('short_description');
        this.document.define('description');
    
        this.contributors = new module.model.Contributors(this);
    
        this.interested = new Interested(this);
    
        this.containers.Item = function (data) {
    
            if (!data || (!data.published && !data.stored)) {
                console.error('invalid data', data);
                return;
            }
    
            var entity;
            if (data.published) entity = data.published.entity;
            if (!data.published && data.stored) entity = data.stored.entity;
    
            if (!entity) {
                console.error('invalid data', data);
                return;
            }
    
            if (entity.ID === '5') {
                return new Section(data);
            }
            else if (entity.ID === '2') {
                return new module.model.User(data);
            }
    
        };
    
        this.set = function (params) {
    
            graph.set.call(this, params);
            if (params) this.interested.set(params.published);
    
        };
    
        this.set(params);
    
    };
    
    
    /*******************************
     FILE NAME: sections/sections.js
     *******************************/
    
    var Sections = function () {
        "use strict";
    
        var api = {'module': module, 'path': 'sections'};
        var Collection = module.model.Collection;
        Collection.call(this, api);
    
        this.Item = function (data) {
    
            var section = new Section({
                'published': data
            });
    
            return section;
    
        };
    
    };
    
    
    /******************************
     FILE NAME: sections/section.js
     ******************************/
    
    var Section = function (params) {
        "use strict";
    
        var api = {'module': module, 'path': 'sections'};
    
        var Graph = module.model.Graph;
        var graph = Object.create(Graph.prototype);
        Graph.call(this, api);
    
        this.entity.ID = '5';
    
        // define document properties
        this.document.define('title');
        this.document.define('short_description');
        this.document.define('description');
    
        this.contributors = new module.model.Contributors(this);
    
        this.set(params);
    
    };
    
    
    /********************
     FILE NAME: define.js
     ********************/
    
    var dependencies = ['libraries/graphs/model'];
    
    define(dependencies, function (model) {
        "use strict";
    
        module.model = model;
    
        return {
            'Article': Article,
            'Gallery': Gallery,
            'OGVideo': OGVideo,
            'Post': Post,
            'Topics': Topics,
            'Topic': Topic,
            'Sections': Sections,
            'Section': Section
        };
    
    });
    
    
    
    done('libraries/contents/assets', 'code');

})(beyond.modules.get('libraries/contents/assets'));