(function (path) {

    let paths = {
        'jquery': `${path}/static/bower_components/jquery/dist/jquery`,
        'require.js': `${path}/static/require.js/require`,
        'socket.io': `${path}/static/socket.io/socket.io.min`,
        'react': `${path}/static/react/react`,
        'react-dom': `${path}/static/react/react-dom`,
        'fastclick': `${path}/static/mobile/fastclick`
    };

    if (!beyond.params.local) {
        paths['jquery'] += '.min';
        paths['require.js'] += '.min';
        paths['react'] += '.min';
        paths['react-dom'] += '.min';
    }

    requirejs.config({
        paths: paths
    });

    requirejs.config({
        shim: {
            'react': {
                // the following line allows you to inject React in your modules
                // instead of using it as a global
                exports: 'React'
            },
            // the following line declares that react-dom depends on react, so
            // RequireJS will load react first whenever you require react-dom
            'react-dom': {
                'deps': ['react'],
                'exports': 'ReactDOM'
            }
        }
    });

})(beyond.requireConfig.paths['libraries/vendor']);
