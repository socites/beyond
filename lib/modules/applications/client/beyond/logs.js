function Logs(beyond) {
    "use strict";

    var style = 'style="';
    style += 'position: absolute;';
    style += 'bottom: 40px; left: 10px; right: 10px;';
    style += 'z-index: 10000;';
    style += 'background: #c7c7c7;';
    style += 'border: 1px solid #333;';
    style += 'padding: 5px;';
    style += 'border-radius: 3px';
    style += 'color: white;';
    style += '"';

    var $log = $('<div ' + style + ' />')
        .addClass('log')
        .hide();

    $('body').append($log);

    this.append = function (msg) {

        var $msg = $('<div />').html(msg);
        $log.append($msg);

        if (beyond.params.showLogs) {
            this.show();
        }

    };

    var timer;
    this.show = function () {

        $log.show();

        clearTimeout(timer);
        timer = setTimeout(Delegate(this, function () {
            this.hide();
        }), 5000);

    };

    this.hide = function () {
        $log.hide();
    };

    if (beyond.params.showLogs) {
        window.onError = function (message, url, line) {
            beyond.logs.append(message + ' - ' + url + ' - on line: ' + line);
        };
    }

}
