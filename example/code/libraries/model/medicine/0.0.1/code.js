/*********************
LIBRARY NAME: medicine
MODULE: .
**********************/

(function (module) {

    var done = module[1];
    module = module[0];

    /********************
     FILE NAME: doctor.js
     ********************/
    
    var Doctor = function (params) {
        "use strict";
    
        var api = {'module': module, 'path': 'doctors'};
    
        var Graph = module.model.Graph;
        var graph = Object.create(Graph.prototype);
        Graph.call(this, api, params);
    
        this.entity.ID = '26';
    
        // define document properties
        this.document.define('bachelorDegree');
        this.document.define('university');
        this.document.define('enablingEntity');
        this.document.define('graduationDate');
        this.document.define('license');
        this.document.define('skype');
        this.document.define('specialty');
        this.document.define('specialtyGraduationDate');
        this.document.define('cv');
    
        this.set(params);
    
    };
    
    
    /*********************
     FILE NAME: doctors.js
     *********************/
    
    var Doctors = function () {
        "use strict";
    
        var api = {'module': module, 'path': 'doctors'};
        var Collection = module.model.Collection;
        Collection.call(this, api);
    
        this.Item = function (data) {
    
            var doctor = new Doctor({
                'published': data
            });
    
            return doctor;
    
        };
    
    };
    
    
    /********************
     FILE NAME: define.js
     ********************/
    
    var dependencies = ['libraries/graphs/model'];
    
    define(dependencies, function (model) {
        "use strict";
    
        module.model = model;
    
        return {
            'Doctor': Doctor,
            'Doctors': Doctors
        };
    
    });
    
    
    
    done('libraries/medicine', 'code');

})(beyond.modules.get('libraries/medicine'));