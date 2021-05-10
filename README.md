 

This is a node module for interacting with the market.csgo.com API.
Docs for endpoints are available [here](https://market.csgo.com/docs/)

## Installation

`npm install market-csgo-api`

## Usage

```javascript
const MarketAPI = require('market-csgo-api');
const APIProvider = new MarketAPI();

or

const APIProvider = new MarketAPI(options)

```
or
```javascript
import MarketAPI from 'market-csgo-api';
```

### Constructor params
Params:
-  

## Properties

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
const MarketAPI = require('market-csgo-api');
const instance = new MarketAPI({apiKey: 'xxxx'});

(async () => {
    let trades = await instance.accountGetTrades();
})()
```
 

### Structure

Main module is MarketAPI class (src/MarketAPI);
In it`s constructor we merge default options and client args.

See list of options and their data types above.

Class instance has v1 and v2 getters (src/v1, src/v2).
Each version getter returns a hash of methodName: function()
pairs.

```javascript
 itemInfo: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'itemInfo'),
```

They can be called like this

```javascript
APIProvider.v1.getMoney()
```

Each function takes request params (hash or nothing) as an argument
and returns a call of async class method "callMethod"

```javascript
callMethod(reqParams: object, version: string , methodName: string);

e.g.

callMethod({someParam: 1}, 'v1' , 'getMoney');

```
