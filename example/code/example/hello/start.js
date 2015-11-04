toolbar.show();

menubar.items.push({
    'ID': 'slave1',
    'priority': 1,
    'text': 'slave1',
    'click': function () {
        "use strict";
        beyond.navigate('/slave1');
    }
});

menubar.items.push({
    'ID': 'master1',
    'priority': 1,
    'text': 'master1',
    'click': function () {
        "use strict";
        beyond.navigate('/master1');
    }
});

menubar.items.push({
    'ID': 'slave2',
    'priority': 1,
    'text': 'slave2',
    'click': function () {
        "use strict";
        beyond.navigate('/slave2');
    }
});

menubar.items.push({
    'ID': 'master2',
    'priority': 1,
    'text': 'master2',
    'click': function () {
        "use strict";
        beyond.navigate('/master2');
    }
});

menubar.update();

$('#content-viewer').addClass('show').css('left', '70px').css('top', '10px').css('z-index', 1);
