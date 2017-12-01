function Page($container) {
    "use strict";

    var $html = $(module.render('page'));
    $container.attr('id', 'compile-page').html($html);

}
