function PullDown(host) {
    "use strict";

    var events = new Events({'bind': this});

    var $host = $(host);
    $host.addClass('pulldown-host');

    var parentScroller;
    var $pulldown = $host.find('.pull-down');
    var initialY;
    var translateY;
    var pulledDown = false;

    function clear() {

        pulledDown = false;
        initialY = undefined;

        var transform = 'translate3d(0, 0, 0)';
        $host.css('transform', transform);
        $host.addClass('animated-pull-down');
        $pulldown.removeClass('pulled');
        $pulldown.css('opacity', 0);

    }

    function onTouchEnd() {

        // Pull down is already pulled down
        if (pulledDown) return;

        if (translateY === 50) {
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
        if (pulledDown) return;

        if (!parentScroller || parentScroller.scrollTop !== 0) return;

        var touches = event.originalEvent.touches;
        if (touches.length !== 1) return;

        if (!initialY) initialY = touches[0].clientY;
        var moveY = touches[0].clientY - initialY;

        if (moveY < 0) return;

        moveY = parseInt(moveY / 5);

        event.preventDefault();

        if (moveY > 50) moveY = 50;

        var transform = 'translate3d(0, ' + moveY + 'px , 0)';
        $host.css('transform', transform);
        var opacity = moveY / 50;
        $pulldown.css('opacity', opacity);
        $host.removeClass('animated-pull-down');

        translateY = moveY;

    }

    $host.bind('touchend', onTouchEnd);
    $host.bind('touchmove', onTouchMove);

    this.clear = clear;

    this.setParentScroller = function (value) {
        console.log('setParentScroller * pulldown.js', value);
        parentScroller = value;
    };

    this.show = function () {

        pulledDown = true;
        initialY = undefined;

        var transform = 'translate3d(0, 50px, 0)';
        $host.css('transform', transform);
        $host.addClass('animated-pull-down');
        $pulldown.addClass('pulled');
        $pulldown.css('opacity', 1);

    };

}
