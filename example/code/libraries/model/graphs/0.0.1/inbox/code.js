/*******************
LIBRARY NAME: graphs
MODULE: inbox
********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /**************************
     FILE NAME: conversation.js
     **************************/
    
    var Conversation = function (data) {
        "use strict";
    
        if (!data) data = {};
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        var ID;
        if (data.ID) ID = data.ID;
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            }
        });
    
        Object.defineProperty(this, 'sent', {
            'get': function () {
                return (typeof ID !== 'undefined');
            }
        });
    
        this.subject;
        if (data.subject) this.subject = data.subject;
    
        var state;
        if (data.state) state = data.state;
        Object.defineProperty(this, 'state', {
            'get': function () {
                return state;
            }
        });
    
        this.lastMessage = {};
        if (data.lastMessage) this.lastMessage = data.lastMessage;
    
        var sending;
        this.send = function (message, callback) {
    
            if (sending) return;
            if (ID) {
                console.error('conversation already sent');
                return;
            }
    
            sending = true;
    
            this.lastMessage = {};
            this.lastMessage.from = auth.sessions.community.me;
            this.lastMessage.to = message.to;
            this.lastMessage.text = message.text;
    
            var params = {
                'to': message.to.ID,
                'subject': this.subject,
                'text': message.text,
                'token': auth.sessions.community.token
            };
    
            module.execute('messages/send', params, function (response) {
    
                ID = response;
                sending = false;
    
                if (callback) callback(ID);
                events.trigger('sent', ID);
    
            });
    
        };
    
        this.read = function () {
    
            var params = {
                'ID': ID,
                'token': auth.sessions.community.token
            };
            module.execute('conversations/read', params, function (response) {
                state = '4';
                events.trigger('read');
            });
    
        };
    
    };
    
    
    /***************************
     FILE NAME: conversations.js
     ***************************/
    
    var Conversations = function () {
        "use strict";
    
        var Collection = module.model.Collection;
        var api = {'module': module, 'path': 'conversations'};
        Collection.call(this, api);
    
        this.Item = function (data) {
    
            var conversation = new Conversation(data);
            return conversation;
    
        };
    
    };
    
    
    /*********************
     FILE NAME: message.js
     *********************/
    
    var Message = function (data) {
        "use strict";
    
        if (!data) data = {};
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        var ID;
        if (data.ID) ID = data.ID;
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            }
        });
    
        this.conversationID;
        if (data.conversationID) this.conversationID = data.conversationID;
    
        this.text;
        if (data.text) this.text = data.text;
    
        this.sent;
        if (data.sent) this.sent = data.sent;
    
        this.from;
        if (data.from) this.from = data.from;
    
        this.to;
        if (data.to) this.to = data.to;
    
        var sending;
        this.send = function (to, text, callback) {
    
            if (sending) return;
            if (ID) {
                console.error('conversation already sent');
                return;
            }
    
            if (!this.conversationID) {
                console.error('conversationID not set');
                return;
            }
    
            sending = true;
    
            this.to = to;
            this.text = text;
    
            var params = {
                'to': to,
                'text': text,
                'conversationID': this.conversationID,
                'token': auth.sessions.community.token
            };
    
            module.execute('messages/send', params, function (response) {
    
                ID = response;
                sending = false;
    
                if (callback) callback();
                events.trigger('sent');
    
            });
    
        };
    
    };
    
    
    /**********************
     FILE NAME: messages.js
     **********************/
    
    var Messages = function () {
        "use strict";
    
        var Collection = module.model.Collection;
        var api = {'module': module, 'path': 'messages'};
        Collection.call(this, api);
    
        this.Item = function (data) {
    
            var message = new Message(data);
            return message;
    
        };
    
    };
    
    
    /********************
     FILE NAME: define.js
     ********************/
    
    var dependencies = ['libraries/graphs/model'];
    
    define(function (model) {
        "use strict";
    
        module.model = model;
    
        return {
            'Conversations': Conversations,
            'Conversation': Conversation,
            'Messages': Messages,
            'Message': Message
        };
    
    });
    
    
    
    done('libraries/graphs/inbox', 'code');

})(beyond.modules.get('libraries/graphs/inbox'));