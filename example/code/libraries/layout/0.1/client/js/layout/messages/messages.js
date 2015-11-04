var LayoutMessages = function () {
    "use strict";

    var self = this;

    var $container = $('#messages');
    var $title = $container.find('.title');
    var $body = $container.find('.body');
    var $previous = $container.find('.previous');
    var $next = $container.find('.next');
    var $dismiss = $container.find('.dismiss');
    var $close = $container.find('.close');

    var messages = {};
    var ids = [];
    var actual;

    var id = 0;

    var updateContent = function () {

        var message = messages[actual];
        $title.html(message.title);
        $body.html(message.message);

        $container.removeClass('error info');
        if (message.type === 'error') {
            $container.addClass('error');
        }
        else if (message.type === 'info') {
            $container.addClass('info');
        }

    };

    var updatePages = function () {

        if (ids.length === 0) {
            $container.hide();
            return;
        }

        if (ids.length === 1) {
            $container.removeClass('previous next');
            return;
        }

        if (ids.indexOf(actual) === 0) {
            $container.removeClass('previous');
        }
        else {
            $container.addClass('previous');
        }

        if (ids.indexOf(actual) === ids.length - 1) {
            $container.removeClass('next');
        }
        else {
            $container.addClass('next');
        }

    };

    $previous.click(function () {

        if (!$container.hasClass('previous')) {
            return;
        }

        actual = ids[ids.indexOf(actual) - 1];
        updateContent();
        updatePages();


    });

    $next.click(function () {

        if (!$container.hasClass('next')) {
            return;
        }

        actual = ids[ids.indexOf(actual) + 1];
        updateContent();
        updatePages();

    });

    this.remove = function (id) {

        if (!messages[id]) {
            return;
        }

        delete messages[id];
        var remove = ids.indexOf(id);

        if (ids.length === 1) {
            $container.hide();
            actual = undefined;
        }
        else if (remove === 0) {
            // it is being removed the first element
            actual = ids[1];
        }
        else if (remove === ids.length - 1) {
            // it is being removed the last element
            actual = ids[ids.length - 2];
        }

        ids.splice(remove, 1);

        if (actual) {
            updateContent();
            updatePages();
        }

    };

    $dismiss.click(function () {

        self.remove(actual);

    });

    $close.click(function () {
        id = 0;
        ids = [];
        messages = {};
        actual = undefined;

        $container.hide();
    });

    this.push = function (title, message, type, timeout) {

        id++;
        ids.push(id);
        messages[id] = {
            'title': title,
            'message': message,
            'type': type,
            'id': id
        };

        if (type === 'error') {
            $container.addClass('error');
        }
        else {
            $container.removeClass('error');
        }

        actual = id;
        updateContent();
        updatePages();

        $container.show();

        if (timeout) {
            (function (id) {
                setTimeout(function () {

                    self.remove(id);

                }, timeout);
            })(id);
        }

        return id;

    };

};
