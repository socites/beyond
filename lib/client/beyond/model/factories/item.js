function ItemFactory(Item) {
    "use strict";

    // The items instances
    var items = new Map();

    // The newly created items that are not persisted and doesn't have its id
    var created = [];

    this.get = function (id) {

        if (items.has(id)) {
            return items.get(id);
        }

        var item = new Item(id);
        items.set(id, item);

        return item;

    };

    this.create = function () {

        var item = new Item();

        function unbind() {
            item.unbind('added', onAdded);
            item.unbind('destroyed', onDestroyed);
        }

        function onAdded() {

            if (!item.id) {
                console.log('Item:', item);
                throw new Error('Item with its id was expected');
            }
            unbind();

            created.splice(created.indexOf(item), 1);
            items.set(item.id, item);

        }

        function onDestroyed() {

            unbind();
            created.splice(created.indexOf(item), 1);

        }

        item.bind('added', onAdded);
        item.bind('destroyed', onDestroyed);

    };

}
