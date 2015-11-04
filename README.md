![](https://socites.github.io/beyond/img/logos/logo-light.png)
# BeyondJS [![Build Status](https://img.shields.io/travis/socites/beyond/master.svg)](https://travis-ci.org/socites/beyond) [![npm version](https://img.shields.io/npm/v/beyond.svg)](https://www.npmjs.com/package/beyond) [![Dependency Status](https://img.shields.io/david/socites/beyond.svg)](https://david-dm.org/socites/beyond) [![Dev-Dependency Status](https://img.shields.io/david/dev/socites/beyond.svg)](https://david-dm.org/socites/beyond#info=devDependencies)
> `BeyondJS` is a framework for building scalable, modular, single page web applications.


`BeyondJS` is a JavaScript framework for building web application that can be easily packaged and deployed on web and mobile. To achieve this goal, BeyondJS solves:
* module bundler, package your modules.
* Load on demand of packages.
* Packages can embed html, css and javascript.
* Realtime ready.
* Single page.
* Offline ready.
* Multilanguage apps.
* Browser-side html templating.

`BeyondJS` integrates `socket.io`, `mustache` templating, `require.js` for load on demand of resources and of course, `jquery`.

[Learn how to use Beyond in your own project](https://socites.github.io/beyond/guides/get-started)

## Installation

The way to get started is install with `npm`:
```sh
npm install beyond --save
```

#### Prerequisites

The only prerequisite is [Node.js](https://nodejs.org/en/) version 4.0 at least, Even so, it may can work with version 0.12.7

## Example Usage
We have a entire example on the [website](https://socites.github.io/beyond/). Here is the first one step to get you started:

```javascript
(function (beyond) {
   beyond.start();
})(new (require('beyond'))(specs, config));
```

### Scaffolding a BeyondJS App

May be interested in use a Yeoman generator, if it is the case, you can find information [here](https://github.com/rhaynel-parra/generator-beyond/)


```sh
# Install required tools yo, grunt-cli, bower and generator-beyond
npm install -g yo grunt-cli bower generator-beyond
# Make a new directory, and cd into it:
mkdir my-new-project && cd $_
# Run yo generator-beyond:
yo beyond
```
Finally run `grunt serve` for preview.

## Contribute

The main purpose of this repository is to continue to evolve `BeyondJS` core, making it faster and easier to use. If you're interested in helping with that, then keep reading. If you're not interested in helping right now that's ok too. :) Any feedback you have about using `BeyondJS` would be greatly appreciated.

### Testing Your Copy of BeyondJS

The process to test `BeyondJS` is built entirely on top of `node.js`, using many libraries you may already be familiar with.

#### Prerequisites

* You have `node` installed at v4.0.0+ and `npm` at v2.0.0+.
* You are familiar with `npm` and know whether or not you need to use `sudo` when installing packages globally.
* You are familiar with `git`.

#### Test

Once you have the repository cloned, testing a copy of `BeyondJS` is really easy.

```sh
# mocha is needed for the test; you might have this installed already
npm install -g mocha
mocha test/**
```

## License

[BeyondJS](https://socites.github.io/beyond/) [MIT](https://opensource.org/licenses/MIT) © [Socites](http://socites.com/).