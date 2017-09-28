# RPC call
To execute a server action
```javascript
var action = new module.Action(actionPath);
action.onResponse = function() {...};
action.onError = function() {...};

action.execute();
```


## action.execute();
Response
{'promise': Promise, 'cancel': function}
