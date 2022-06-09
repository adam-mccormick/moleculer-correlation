![Moleculer logo](http://moleculer.services/images/banner.png)

[![Build Status](https://travis-ci.org/adam_mccormick/moleculer-correlation.svg?branch=master)](https://travis-ci.org/adam_mccormick/moleculer-correlation)
[![Coverage Status](https://coveralls.io/repos/github/adam_mccormick/moleculer-correlation/badge.svg?branch=master)](https://coveralls.io/github/adam_mccormick/moleculer-correlation?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/adam_mccormick/moleculer-correlation/badge.svg)](https://snyk.io/test/github/adam_mccormick/moleculer-correlation)

# moleculer-correlation [![NPM version](https://img.shields.io/npm/v/moleculer-correlation.svg)](https://www.npmjs.com/package/moleculer-correlation)

Log correlation for Moleculer via AsyncLocalStorage

## Features

Adds the current context's `requestID` to any log messages made while the context is available. Takes 
advantage of Node 14+ `AsyncStorage`.

## Install
```
npm install moleculer-correlation --save
```

## Usage

```javascript
const { ServiceBroker } = require("moleculer");
const { CorrelationMiddleware } = require("moleculer-correlation");

const broker = new ServiceBroker({
    middlewares: [CorrelationMiddleware]
});

// --- SERVICE ---
broker.createService({
    name: "greeter",
    actions: {
        hello: {
            handler(ctx) {
                this.logger.info("Creating a Greeting")
                return `Hello ${ctx.params.name}`;
            }
        }
    }
});

// --- TEST ---
broker.start()
    .then(() => broker.call("greeter.hello").then(res => broker.logger.info(res)))

// --- CONTEXT REQUEST ID IN LOGS WHEN AVAILABLE ---
// [2022-06-09T03:18:02.291Z] INFO  node/GREETER: [2e524af4-69a1-440f-9a1d-1904a6b28258]  Creating a Greeting

```

## Test
```
$ npm test
```

In development with watching

```
$ npm run ci
```

## Contribution
Please send pull requests improving the usage and fixing bugs, improving documentation and providing better examples, or providing some testing, because these things are important.

## License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact
Copyright (c) 2022 Adam McCormick

[![@MoleculerJS](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![@MoleculerJS](https://img.shields.io/badge/twitter-MoleculerJS-blue.svg)](https://twitter.com/MoleculerJS)
