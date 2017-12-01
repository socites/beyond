(function (module) {

    var done = module[1];
    module = module[0];

    /**********
     CSS STYLES
     **********/
    
    (function() {
    	var styles = '#body{background:#00f;color:red}';
    	var is = '';
    	module.styles.push(styles, is);
    })();
    
    
    done('libraries/library1/page', 'custom');

})(beyond.modules.get('libraries/library1/page'));