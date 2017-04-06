# CSGO.tm API

This is a node module for interacting with the csgo.tm API.
Docs available [here](https://csgo.tm/docs/)

## Installation

`npm install node-csgotm-api`

## Usage

```javascript
var csgotm = require('node-csgotm-api');
var api = new csgotm.API({apiKey: 'API key here'});
```

All API-call methods return Promise, and they have `gotOptions` param for [got](https://github.com/sindresorhus/got) module

## Example



```javascript
api.accountGetTrades().then(trades => {
  console.log(trades);
}).catch(error => {
  console.log(error);
});
```
