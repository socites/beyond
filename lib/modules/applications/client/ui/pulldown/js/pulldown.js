function PullDown(host, scroll) {
    "use strict";

    if (!scroll) {
        scroll = host;
    }

    var height = 62;

    var events = new Events({'bind': this});

    var $host = $(host);
    $host.addClass('pulldown-host');

    var $container = $host.find('.pulldown-container');

    var $pulldown = $host.find('.pulldown');
    var initialY;
    var translateY;
    var pulledDown = false;

    function clear() {

        pulledDown = false;
        initialY = undefined;

        var transform = 'translate3d(0, 0, 0)';
        $container.css('transform', transform);

        $host.addClass('animated-pulldown');
        $pulldown.removeClass('pulled');
        $pulldown.css('opacity', 0);

    }

    function onTouchEnd() {

        // Pull down is already pulled down
        if (pulledDown) return;

        if (translateY === height) {
            pulledDown = true;
            events.trigger('pulled');
            $pulldown.addClass('pulled');
        }
        else {
            clear();
        }

    }

    function onTouchMove(event) {

        // Pull down is already pulled down
        if (pulledDown || scroll.scrollTop !== 0) {
            return;
        }

        var touches = event.originalEvent.touches;
        if (touches.length !== 1) return;

        if (!initialY) initialY = touches[0].clientY;
        var moveY = touches[0].clientY - initialY;

        if (moveY < 0) return;

        moveY = parseInt(moveY / 5);

        event.preventDefault();

        if (moveY > height) moveY = height;

        var transform = 'translate3d(0, ' + moveY + 'px , 0)';
        $container.css('transform', transform);

        var opacity = moveY / height;
        $pulldown.css('opacity', opacity);
        $host.removeClass('animated-pulldown');

        translateY = moveY;

    }

    $host.bind('touchend', onTouchEnd);
    $host.bind('touchmove', onTouchMove);

    this.clear = clear;

    this.show = function () {

        pulledDown = true;
        initialY = undefined;

        var transform = 'translate3d(0, ' + height + 'px, 0)';
        $container.css('transform', transform);

        $host.addClass('animated-pulldown');
        $pulldown.addClass('pulled');
        $pulldown.css('opacity', 1);

    };

}
