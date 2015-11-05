/*********************
LIBRARY NAME: payments
MODULE: .
**********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /*******************
     FILE NAME: start.js
     *******************/
    
    var ActivePayments = function () {
        "use strict";
    
        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };
    
        var session = auth.sessions.community;
    
        var inquiries = {};
        Object.defineProperty(this, 'inquiries', {
            'get': function () {
                return inquiries;
            }
        });
    
        this.push = function (inquiry) {
            events.trigger('pushed', inquiry)
        };
    
        var fetching, fetched = false;
        Object.defineProperty(this, 'fetching', {
            'get': function () {
                return fetching !== undefined;
            }
        });
        Object.defineProperty(this, 'fetched', {
            'get': function () {
                return fetched;
            }
        });
    
        var fetch = function () {
    
            if (fetching) return;
    
            fetching = Date.now();
    
            var params = {
                'token': session.token,
                'ts': fetching,
                'patientID': session.account.user.ID
            };
    
            module.execute('inquiries/active', params, function (response) {
    
                if (response.ts !== fetching) return;
    
                fetching = false;
                fetched = true;
    
                for (var i in response.inquiries) {
    
                    var inquiry = response.inquiries[i];
                    if (inquiry.time <= 0) continue;
    
                    var userID = inquiry.userID;
    
                    if (!inquiries[userID]) inquiries[userID] = [];
                    inquiries[userID].push(inquiry);
    
                }
                events.trigger('fetched', inquiries);
    
            });
    
        };
    
        this.push = function (userID, type) {
    
            var inquiry = {
                'userID': userID,
                'type': type,
                'start': undefined,
                'countdown': undefined
            };
    
            if (!inquiries[userID]) inquiries[userID] = [];
            inquiries[userID].push(inquiry);
    
            events.trigger('pushed', inquiry);
    
        };
    
        this.update = function (userID, inquiryID) {
    
            var inquiry;
            for (var i in inquiries[userID]) {
                inquiry = inquiries[userID][i];
                if (!inquiry.inquiryID) inquiry.inquiryID = inquiryID;
                break;
            }
    
            events.trigger('update', inquiry);
    
        };
    
        var update = function () {
    
            fetching = false;
            fetched = false;
            inquiries = {};
    
            if (session.valid) fetch();
    
        };
    
        session.bind('change', update);
        update();
    
    };
    
    window.payments = {'active': new ActivePayments()}
    
    
    
    done('libraries/payments', 'code');

})(beyond.modules.get('libraries/payments'));