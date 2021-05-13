This is a node module for interacting with the market.csgo.com API. Docs for endpoints are
available [here](https://market.csgo.com/docs/)

# Installation

`npm install market-csgo-api`

# Usage

````javascript
const MarketAPI = require('market-csgo-api');
const APIProvider = new MarketAPI({
    APIKey: 'myKey1432xx'
});
````

## Constructor params

````javascript
{
    /**
     * default false.
     * Get errors in case of 400+, 500+ responses, timeouts etc
     * or {success: false}
     */
    APIErrorsToJSON: boolean, /**
     * CSMarket API key to request private endpoints
     */
        APIKey
:
    string, /**
     * Object with API params. Not used now
     */
        APIParams
:
    {
        currency
        language
        marketAppId
        getWarnings
    }
}
````

## Methods

### v1

- APIProvider.v1.setToken()
- APIProvider.v1.operationHistory()
- APIProvider.v1.getProfileItems()
- APIProvider.v1.itemInfo()
- APIProvider.v1.setPrice()
- APIProvider.v1.itemRequest()
- APIProvider.v1.massSetPrice()
- APIProvider.v1.getOrders()
- APIProvider.v1.insertOrder()
- APIProvider.v1.updateOrder()
- APIProvider.v1.processOrder()
- APIProvider.v1.updateNotification()
- APIProvider.v1.getMassInfo()
- APIProvider.v1.getFloatHash()
- APIProvider.v1.getWSAuth()
- APIProvider.v1.getDBFileName()
- APIProvider.v1.getDBData()
- APIProvider.v1.getHistory()

### v2

#### getMoney

```javascript
APIProvider.v2.getMoney() //Get currency and balance
````

#### goOffline

```javascript
APIProvider.v2.goOffline() // Go offline with WS client
````    

#### ping

```javascript
APIProvider.v2.ping() //Ping WS connection
````

- APIProvider.v2.updateInventory()
- APIProvider.v2.items()
- APIProvider.v2.history()
- APIProvider.v2.trades()
- APIProvider.v2.transferDiscounts()
- APIProvider.v2.getMySteamId()
- APIProvider.v2.myInventory()

```javascript
APIProvider.v2.buy() //Buy item
````

- APIProvider.v2.buyFor()
- APIProvider.v2.getBuyInfoByCustomId()
- APIProvider.v2.getListBuyInfoByCustomId()
- APIProvider.v2.addToSale()
- APIProvider.v2.setPrice()
- APIProvider.v2.removeAllFromSale()
- APIProvider.v2.tradeRequestGive()
- APIProvider.v2.tradeRequestGiveP2p()
- APIProvider.v2.tradeRequestGiveP2pAll()
- APIProvider.v2.searchItemByHashName()
- APIProvider.v2.searchItemByHashNameSpecific()
- APIProvider.v2.searchListItemsByHashNameAll()
- APIProvider.v2.getListItemsInfo()

#### getWSAuth

````javascript  
APIProvider.v2.getWSAuth() //Re-auth WS connection <= 1r/60s
````

- APIProvider.v2.getPrices()
- APIProvider.v2.getPricesWithClassInstance()

# Structure

## Class

Main module is MarketAPI class `src/MarketAPI`

In its constructor we merge default options and client args into

`this.state`

It requires API key and other params and initiates limiter (Bottleneck)
triggering requests <= 5rr/sec

See the list of options & their data types above.

## Kinda stuff

- `src/helpers` contains utils for validating data etc
- `src/enums` contains data like validation schemas for init options
- `src/emitters` contains event emitter like error processor etc
- `json` contains stuff like dictionaries and so

## Versions

Class instance has v1 and v2 getters `src/v1`,`src/v2`.

Each version getter returns a hash of methodName: function()
pairs.

```javascript
 itemInfo: (reqParams: object) => this.callMethod.call(this, reqParams, 'v1', 'itemInfo'),
```

They can be called like this

```javascript
APIProvider.v1.getMoney()
```

Each value function takes request params (hash or nothing) as an argument and returns a call of async class method "
callMethod"

````javascript
callMethod(reqParams,  // object or nothing 
    version, // string 'v1'/'v2'
    methodName  // string, e.g. 'getMoney'
);
````

e.g.

````javascript
callMethod({someParam: 1}, 'v1', 'getMoney')
    .then(result => {});
````

## Methods building

"callMethod" is an async function, it returns promise.

````javascript
await callMethod({someParam: 1}, 'v1', 'getMoney');
````

"callMethod" function gets params and validates them.

Then it takes method data - name, version, HHTP method (GET/POST), API route, validation schema for request params,
query params - from `API/v/{version}/method_defaults`

after it this request is being scheduled by limiter and triggered as a callback.

## Fetching

Fetcher (API/fetch/index.js) builds URL with builder (API/fetch/helpers), Data for build from config - protocol, host
Version-sensitive data - pathhname Param data - route, query params

Final URL be like

````javascript
https://market.csgo.com/api/v2/get-money?key=qwerty123
````

Then we pass it to fetcher ('got' npm lib) and get the parsed JSON in response

## Response processing

This response is being checked ('success' field) as a callback to the fetch request in "callMethod".

After this "callMethod" throws error or resolves with JSON

````javascript
  callMethod({someParam: 1}, 'v1', 'getMoney')
    .then(result => {})
    .catch(({type, message}) => {});
````

## Errors

Errors are being catched and then thrown to the client with

````javascript
{
    type, //string
        message //string 
}
````

### Type

- `client`  Bad params format when you init class inst or call a method
- `API`  If market API returns error status & you want to get those errors to be thrown
- `uncaught` If an error didn't get its type, the last error middleware set it to 'uncaught'

### Message

see `json/dictionary.json` for error messages

# Build

`npm run build` compiles stuff from `src` dir to `dist`

# Tests

1) in `test/stuff` rename `.test_API_key` to `test_API_key`
2) add your key there
3) run `npm run test`. It compiles .ts to .js and tests js out

# N.B.:

As an Orthodox Russian redneck, I suffer from 'shaitan' naming >:-)

Hope this lib will work `Ad majore Dei gloriam`
