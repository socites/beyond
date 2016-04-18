# Getting Started with `BeyondJS`

## Install `BeyondJS`
The way to get started is by installing `BeyondJS` with `node` and `npm`.
Install [node and npm](https://nodejs.org/en/download/) if not already on your machine.
```sh
npm install -g beyond
```

## Start learning `BeyondJS` 

### Clone the Getting Started Repository
Create a folder on your prefered location where to host the Get Started code, and clone the following git repository.
```sh
git clone https://github.com/beyondjs/getstarted.git
```

#### Install the dependencies of the Getting Started Code
The Getting Started code has npm dependencies specified in the package.json of the project.
Type npm install in the folder where the code of the Getting Started code resides.
```sh
npm install
```

### Run the Getting Started Application by Running `BeyondJS`
Type and execute beyond in the folder where the Getting Started code resides.
```sh
beyond
```

By default, BeyondJS executes listening http and websockets in the 3010 and 3011 ports.
If a different service is listening in any of those ports, you can change them by creating a **server.json** file.

Now you can run your application by opening your prefered browser and navigating http://localhost:3010.

The **getting started** code has five modules. Four of them are modules defined as pages, meaning that they can be navigated. To do so, just navigate the following urls.
* http://localhost:3010/hello
* http://localhost:3010/polymer
* http://localhost:3010/react
* http://localhost:3010/timestamp

Remember that **BeyondJS** applications are Single Page Applications that load the modules and their dependencies on demand.
To try it, you can open the dev tools console and type beyond.navigate('/_page_'), where _page_ is the url defined in the module ('/hello', '/polymer', '/react', '/timestamp');

### Understanding the Structure of the Application
BeyondJS requires the index.html file being at the root of your application folder.
The index.html is the entry point of your application and you can find it in the root of the Getting Started project.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Beyond Application</title>

    <!-- #beyond.head -->
</head>

<body>

My First Beyond Application

</body>
</html>
```

In the head section of the index.html file, you can find a comment referring #beyond.head.
This is the place where beyond will inject the required resources to start running your application.

Once you have your index.html file, you can start creating modules.

In the **Getting Started** project you can navigate the code of the following modules.

#### hello
The hello module is a very simple module that renders a Hello World message in a div container.
This module has only javascript code.

#### polymer
This module uses three polymer components, "paper-toolbar", "paper-icon-button" and "iron-icons", that will be loaded on demand when the url /polymer is navigated.

**The module.json file**
```javascript
{
  "page": {
    "route": "/polymer",
    "dependencies": {
      "polymer": [
        "paper-toolbar",
        "paper-icon-button",
        "iron-icons"
      ]
    }
  },
  "code": {...},
}
```

**The html code**
```html
<paper-toolbar>
    <paper-icon-button class="back" icon="arrow-back"></paper-icon-button>
    <div class="title">My Polymer Toolbar</div>
</paper-toolbar>
```

#### model and timestamp
These two modules where built to work together.
The model has the responsibility to interact with the backend and represents a basic model. This module executes server side code.

As you can see below, the module exposes a Model object who has a getTimeStamp method.
The getTimeStamp method is asynchronous and receives a callback as its only parameter.

The model object of the model module, calls the **module.execute** method to execute the **getTimeStamp** server action.
```javascript
function Model() {
    "use strict";

    this.getTimeStamp = function (callback) {

        module.execute('getTimeStamp', function (response, error) {

            if (error) {
                callback();
                return;
            }

            callback(response);

        });

    };

}

define(function () {
    "use strict";

    return Model;

});
```

**The module.json file of the _model_ module**
You can find the specification of the folder where the actions resides. As you can see, the client code and the server code resides in the folder of the module, very closely.
```javascript
{
  "code": {
    "js": {
      "files": [
        "index.js"
      ]
    }
  },
  "server": "actions"
}
```

**The server code**
This action is also asynchronous. Beyond uses the **socites/async** package to make easier the development of asynchronous actions.
```javascript
var async = require('async');

module.exports = function () {
    "use strict";

    this.getTimeStamp = async(function *(resolve, reject) {

        setTimeout(function () {
            resolve(Date.now());
        }, 1000);

    });

};
```

The timestamp module represents the view that requires the **model** module.

In the **module.json** of the **timestamp** module is defined the dependency to the **model** module.
```javascript
{
  "page": {
    "route": "/timestamp",
    "dependencies": {
      "require": {
        "application/model": "model"
      }
    }
  },
  "code": {...}
}
```

The model dependency is exposed in the _module.dependencies_ object, as you can see below.
```javascript
    var Model = module.dependencies.model;
    var model = new Model();
```

Below you can see how the model object is consumed by the view.
```javascript
    var render = function (done) {

        var html = module.render('index');

        $container = $('<div />')
            .attr('id', 'timestamp-page')
            .html(html);

        $('body').append($container);

        model.getTimeStamp(function (timestamp) {

            $container.find('.timestamp .value').html(timestamp);
            done();

        });

    };
```


#### react
The react module shows how to use react in your modules.

Lets see the module specification in **the module.json file**.
```javascript
{
  "page": {
    "route": "/react",
    "dependencies": {
      "require": {
        "react": "React",
        "react-dom": "ReactDom"
      }
    }
  },
  "code": {
    "jsx": {
      "files": [
        "hello.jsx"
      ]
    },
    "js": {
      "files": [
        "model.js",
        "index.js"
      ]
    }
  }
}
```

As you can see, code specification has a jsx entry, with the file hello.jsx.
Hello.jsx is a react / jsx component. `BeyondJS` automatically compiles the jsx resources to be used by the module as can be seen bellow.
```javascript
    function render() {

        $container = $('<div/>')
            .attr('id', "react-hello-container");

        $('body').append($container);
        container = $('body').find('#react-hello-container').get(0);

        var HelloReactComponent = react.hello;
        ReactDOM.render(
            React.createElement(HelloReactComponent, model),
            container);

        if (done) done();

    }
```

# Going deeper
Don't be shine and start creating your modules! Your feedback is valuable for us.
Stay tuned to find more detailed documentation soon.
