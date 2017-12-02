var host = beyond.requireConfig.paths['libraries/beyond'] + '/pages/templates/page.basic/code';

requirejs.config({
    paths: {
        'page.basic': host
    }
});
