var MainMenubar = function (sidebar, events) {
    "use strict";

    var $container = $('#menubar');
    $container.data('api', this);

    Menubar.call(this, sidebar, events, $container);

    var navigate = function (href) {

        sidebar.hide();

        if (!href) return;
        if (href.substr(0, 4) === 'http') window.open(href, '_blank');
        else application.navigate(href);

    };

    var texts = module.texts.menubar;
    if (texts && texts.contact && texts.contact.about) {

        var $contact = $container.children('.contact');
        $contact.addClass('about');
        $contact.click(function () {
            navigate(texts.contact.about.href);
        });

    }

    if (texts && texts.footer) {

        var $footer = $container.children('.footer');
        if (texts.footer.terms) {

            $footer.children('.terms').click(function () {
                navigate(texts.footer.terms.href);
            });

        }

        if (texts.footer.privacy) {

            $footer.children('.privacy').click(function () {
                navigate(texts.footer.privacy.href);
            });

        }

    }

};
