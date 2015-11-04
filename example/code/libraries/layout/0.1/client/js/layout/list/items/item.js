var LayoutItem = function (events, specs) {
    "use strict";

    var self = this;

    var $container;

    var ID = specs.ID;
    Object.defineProperty(this, 'ID', {
        'get': function () {
            return ID;
        }
    });

    var update = function () {

        if (!$container) return;

        var text = '';
        if (props.text) text = props.text;
        if (props.icon) text += '<span class=icon>' + props.icon + '</span>';

        $container.children('div.item').html(text);
        $container.attr('title', props.tooltip ? props.tooltip : '');

        var $loading = $container.find('.loading')
        if (props.loading) $loading.show();
        else $loading.hide();

        if (props.selected) $container.addClass('selected');
        else $container.removeClass('selected');

        if (props.picture) $container.children('.item').css('background-image', 'url(' + props.picture + ')');
        else $container.children('.item').css('background-image', '');

        if (props.click || (events && props.event)) {

            $container.unbind('click');
            $container.bind('click', function () {

                if (props.click) props.click(self);
                if (events) events.trigger('item:click', self);
                if (events && props.event) events.trigger(props.event);

            });

        }

        var $notification = $container.children('.notification');
        $notification.html(props.notification ? props.notification : '');
        if (props.notification) $notification.show();
        else $notification.hide();

        var $more = $container.children('.more');
        if (props.more && !$more.length) {
            $more = $('<div />').addClass('more');
            $container.append($more);
        }
        else if (!props.more && $more.length) $more.delete();

    };

    var props = [
        'priority', 'text', 'picture',
        'loading', 'selected', 'click',
        'event', 'notification', 'tooltip',
        'icon', 'autohide'];

    props = new Properties(this, props, specs, update);

    this.render = function () {

        $container = $('<li />').addClass(ID);
        var $item = $('<div />').addClass('item');
        var $notification = $('<div />').addClass('notification');
        var $loading = $('<div />').addClass('loading');

        $container.append([$item, $notification, $loading]);

        return $container;

    };

    var timer;
    this.update = function () {
        clearTimeout(timer);
        timer = setTimeout(update, 50);
    };

};
