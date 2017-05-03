# CSGO.tm API

This is a node module for interacting with the csgo.tm API.
Docs available [here](https://csgo.tm/docs/)

## Installation

`npm install node-csgotm-api`

## Usage

```javascript
var csgotm = require('node-csgotm-api');
var api = new csgotm.API(options);
```

### Constructor params
Params:
- `options[apiKey]`: your API key **required**
- `options[baseUrl]`: url to API. *Default: `https://market.csgo.com/`.*
- `options[apiPath]`: relative path to API. *Default: `api`.*
- `options[useLimiter]`: enable [bottleneck](https://github.com/SGrondin/bottleneck) limiter. *Default: `true`.*
- `options[defaultGotOptions]`: default options for [got](https://github.com/sindresorhus/got) module for all API-call methods without `gotOptions` param(except static). *Default: `{}`.*
- `options[limiterOptions]`: options for [bottleneck](https://github.com/SGrondin/bottleneck) limiter. *Default:*
```
{
    maxConcurrent: 1,
    minTime: 200,
    highWater: -1,
    strategy: Bottleneck.strategy.LEAK,
    rejectOnDrop: true
}
```

## Methods

All API-call methods return Promise, and they have `gotOptions` param for [got](https://github.com/sindresorhus/got) module
#### All methods are divided into blocks with a special prefix (except static) like in [docs](https://csgo.tm/docs/)
- `account`
- `item`
- `sell`
- `buy`
- `order`
- `notification`
- `search`
- `quick`
- `additional`

Many of methods **require** `item` in the params. It should be an object with properties:
- `i_classid` or `classid` or `classId`
- `i_instanceid` or `instanceid` or `instanceId`

## Example

```javascript
api.accountGetTrades().then(trades => {
  console.log(trades);
}).catch(error => {
  console.log(error);
});
```
