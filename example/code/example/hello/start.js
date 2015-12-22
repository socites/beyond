toolbar.show();

menubar.items.push({
    'ID': 'surface1',
    'priority': 1,
    'text': 'surface1',
    'click': function () {
        "use strict";
        beyond.navigate('/surface1');
    }
});

menubar.items.push({
    'ID': 'screen1',
    'priority': 1,
    'text': 'screen1',
    'click': function () {
        "use strict";
        beyond.navigate('/screen1');
    }
});

menubar.items.push({
    'ID': 'surface2',
    'priority': 1,
    'text': 'surface2',
    'click': function () {
        "use strict";
        beyond.navigate('/surface2');
    }
});

menubar.items.push({
    'ID': 'screen2',
    'priority': 1,
    'text': 'screen2',
    'click': function () {
        "use strict";
        beyond.navigate('/screen2');
    }
});

menubar.update();

$('#content-viewer').addClass('show').css('left', '70px').css('top', '10px').css('z-index', 1);
