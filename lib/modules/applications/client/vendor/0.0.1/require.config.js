(function (config, vendorPath) {
    "use strict";

    requirejs.config({
        paths: {
            'jquery': vendorPath + '/static/bower_components/jquery/dist/jquery.min',
            'require.js': vendorPath + '/static/require.js/require.min',
            'socket.io': vendorPath + '/static/socket.io/socket.io.min',
            'react': vendorPath + '/static/react/react',
            'react-dom': vendorPath + '/static/react/react-dom'
        }
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

})(requirejs.config, beyond.requireConfig.paths['libraries/vendor']);
