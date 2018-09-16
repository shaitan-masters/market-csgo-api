# CSGO.tm API

This is a node module for interacting with the csgo.tm API.
Docs available [here](https://market.csgo.com/docs/)

## Installation

`npm install node-csgotm-api`

## Usage

```javascript
var csgotm = require('node-csgotm-api');
var api = new csgotm.API(options);
```
or
```javascript
import {API as api} from 'node-csgotm-api';
```

### Constructor params
Params:
- `options[apiKey]`: your API key **required**
- `options[baseUrl]`: url to API. *Default: `https://market.csgo.com/`.*
- `options[apiPath]`: relative path to API. *Default: `api`.*
- `options[extendedError]`: Should module return full response and got options on market error. Default: `false`.
- `options[useLimiter]`: enable [bottleneck](https://github.com/SGrondin/bottleneck) limiter. *Default: `true`.*
- `options[gotOptions]`: options for [got](https://github.com/sindresorhus/got) module that would be applied for all API-call methods (except static). *Default: `{}`.*
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

## Properties

#### Dynamic
- `options`: merged object of your passed options and default ones
- `apiUrl`: composed api url from base url and api path

#### Static
- `defaultAppId`: CS:GO Steam AppId - 730
- `defaultBaseUrl`: `https://market.csgo.com/`
- `LANGUAGES`: languages, supported by csgo.tm
- `CREATE_TRADE_REQUEST_TYPE`: available types of trade requests
- `MASS_INFO_SELL_BUY`: available types of 'SELL' and 'BUY' param in 'MassInfo' request
- `MASS_INFO_HISTORY`: available types of 'HISTORY' param in 'MassInfo' request
- `MASS_INFO_INFO`: available types of 'INFO' param in `MassInfo` request
- `DEFAULT_MASS_INFO_PARAMS`: default params that will be substituted, when you did not provide some of them

## Methods

All API-call methods return Promise, and they have `gotOptions` param for [got](https://github.com/sindresorhus/got) module
#### All methods are divided into blocks with a special prefix (except static) like in [docs](https://market.csgo.com/docs/)
- `account`
- `item`
- `sell`
- `buy`
- `order`
- `notification`
- `search`
- `quick`
- `additional`

### Static Methods
- `requestJSON(url, gotOptions)`
- `dbName(appId, baseUrl, gotOptions)`
- `itemDb(dbName, baseUrl, gotOptions)`
- `currentItemDb(appId, baseUrl, gotOptions)`
- `history(baseUrl, gotOptions)`
- `getItemIds(item, asNumbers)`
- `formatItem(item, symbol)`

----

Many of methods **require** `item` in the params. It should be an object with properties:
- `i_classid` or `classid` or `classId`
- `i_instanceid` or `instanceid` or `instanceId` or `ui_real_instance`

## Example

```javascript
api.accountGetTrades().then(trades => {
  console.log(trades);
}).catch(error => {
  console.log(error);
});
```
