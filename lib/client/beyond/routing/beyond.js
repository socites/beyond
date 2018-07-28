(function (beyond) {

    if (!beyond) {
        console.error('beyond is not loaded');
        return;
    }

    beyond.extend(function (beyond, events, Dependencies) {

        let pages = new Pages(events, Dependencies);
        Object.defineProperty(beyond, 'pages', {
            'get': () => pages
        });

        let navigation = new Navigation(beyond, pages, events);
        Object.defineProperty(beyond, 'navigation', {
            'get': () => navigation
        });

        Object.defineProperty(beyond, 'pathname', {
            'get': () => navigation.pathname
        });

        beyond.navigate = function () {
            navigation.navigate.call(navigation, ...arguments);
        };

    });

})(window.beyond);
