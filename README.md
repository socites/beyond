![](https://socites.github.io/beyond/img/logos/logo-light.png)
# BeyondJS
Easy development of integrated state-of-the-art technologies, with boosted performance. BeyondJS is a framework for building scalable, modular, single page web applications. BeyondJS integrates out-of-the-box, react, mustache, require.js, polymer, less, socket.io, and more.

[![Build Status](https://img.shields.io/travis/socites/beyond/master.svg)](https://travis-ci.org/socites/beyond)
[![npm version](https://img.shields.io/npm/v/beyond.svg)](https://www.npmjs.com/package/beyond)
[![bitHound Score](https://www.bithound.io/github/socites/beyond/badges/score.svg)](https://www.bithound.io/github/socites/beyond)
[![Dependency Status](https://img.shields.io/david/socites/beyond.svg)](https://david-dm.org/socites/beyond)
[![Dev-Dependency Status](https://img.shields.io/david/dev/socites/beyond.svg)](https://david-dm.org/socites/beyond#info=devDependencies)

# One Framework - Multiple technologies
`BeyondJS` **is not** a framework that does everything by itself, **it is** a framework that integrates powerful existing technologies to create powerful applications.
`BeyondJS` integrates out-of-the-box, `react`, `mustache`, `require.js`, `polymer`, `less`, `socket.io`.

# BeyondJS is evolving fast
`BeyondJS` is evolving fast and it is actually open for evaluation. If after evaluating `BeyondJS` you think that it can help you to build faster and better software, you can contact us, as we strongly believe that with our support you can **take advantage now** on `BeyondJS`.
Otherwise, please stay tuned on the progress of the development of `BeyondJS` or contribute with us with the development and feedback.

## Mobile and Desktop
`BeyondJS` is a JavaScript framework for building scalable and modular, single web application that can be easily packaged and deployed on web and mobile.

`BeyondJS` solves:
* **Module bundler** in a modular development environment. Modules encapsulate mixed resources (html, plain css, less, texts, js, react components, static resources as images and server-side code).
* **Single Page** and **load on demand** ready and easy thanks to `requireJS` AMD technology. Create modules, pages, controls and libraries that are loaded only when required, optimizing the performance and response times. Polymer elements and react components are also loaded on demand.
* **Realtime ready**. `BeyondJS` is based on websockets thanks to socket.io.
* **Server**. With `BeyondJS` you do not require a server to develop, BeyondJS is a server. In development, BeyondJS compiles your modules on the fly.
* **Builder**. `BeyondJS` compiles and prepares your modules to deploy your applications in your production environment. Modular programming means, among other things to be able to develop your client code and your server code together. Not as two different things. But, once we want to deploy to production, we want our static resources separated from the server side code, in a way that we can distribute our client side resources in flat servers, even better on a CDN infrastructure, and the server code in a datacenter with servers prepared to support the required processing load.
* **Offline ready**. HTML5 Offline capabilities are great! And `BeyondJS` takes advantage on that. `BeyondJS` automatically creates the offline manifest.
* **Multilanguage** support. Applications and libraries can be configured to support multiple languages.
* **Client side rendering**. `BeyondJS` supports out-of-the-box, `mustache templating`, `react` and `polymer` to help you build incredible user interfaces very quickly with manteinable code.
* **Polymer and React together**: These two incredible technologies can work together and are ready to be used very easily with no extra setup, and ready to be compiled to production environments without to think on grunt, or webpack.
* **Create incredible Apps** thanks to Polymer. Polymer has a set of beautiful web components that will help you create cool interfaces very fast.
* **Phonegap ready**: `BeyondJS` was designed to develop applications to be compiled both on phonegap, and for the web.

## Install BeyondJS
The way to get started is by installing `BeyondJS` with `node` and `npm`.
Install [node and npm](https://nodejs.org/en/download/) if not already on your machine.
```sh
npm install -g beyond
```

## The Concept
In BeyondJS you develop your code by defining modules. Modules are encapsulated code of mixed resources and are loaded on demand.
You can build modules with plain code or render pages and components. Both pages and components can render polymer and/or react components.

### Structuring your Applications in Modules

#### A Basic Module

**module.json**
```javascript
{
  "code": {
    "html": {
      "files": ["welcome.html"]
    },
    "txt": {
     "files": ["texts.json"]
    }
    "js": {
      "files": ["my-module.js"]
    }
  }
}
```

**welcome.html**
```html
<div class="welcome">
   <div class="message">{{message}}</div>
</div>
```

**texts.json**
```javascript
{
  "en": {
    "message": "Welcome to my first module"
  }
}
```

**my-module.js**
```javascript
function MyModule() {

   this.render = function () {

       var html = module.render('welcome', module.texts);
       var $welcome = $(html);

       $('body').append($welcome);

   };

}
```

## Running BeyondJS
Just run beyond in a terminal console.

```sh
beyond
```


## How to Get Started
You can download and explore our [Get Started repository](https://github.com/beyondjs/getstarted.git).
Stay tuned to find more detailed documentation soon.

## Contribute
The main purpose of this repository is to continue evolving the `BeyondJS` core, making it faster and easier to use. If you're interested in helping with that, then keep reading. If you're not interested in helping right now that's ok too. :) Any feedback you have about using `BeyondJS` would be greatly appreciated.

### Testing Your Copy of BeyondJS
The process to test `BeyondJS` is built entirely on top of `node.js`, and libraries that you are probably already familiar with.

#### Test
Once you have the repository cloned, testing a copy of `BeyondJS` is really easy.

```sh
# mocha is needed for the test; you might have this installed already
npm install -g mocha
mocha test/**
```

## License
[BeyondJS](https://socites.github.io/beyond/) [MIT](https://opensource.org/licenses/MIT) © [Socites](http://socites.com/).
