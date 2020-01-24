"use strict";

const got = require('got');
const util = require('util');
const https = require('https');
const merge = require('merge');
const Bottleneck = require('bottleneck');
const Papa = require('papaparse');
const queryStringify = require('querystring').stringify;

const MarketApiError = require("./MarketApiError");

/**
 * API
 * https://market.csgo.com/docs/
 */
class MarketApi {
    static get defaultAppId() {
        return 730;
    }

    static get defaultBaseUrl() {
        return 'https://market.csgo.com/';
    };

    /**
     * Available languages
     * @returns {{EN: string, RU: string}}
     */
    static get LANGUAGES() {
        return {
            EN: 'en',
            RU: 'ru'
        };
    }

    /**
     * Available types of 'SELL' and 'BUY' param in 'MassInfo' request
     *
     * @returns {{NOTHING: number, TOP_50_SUGGESTIONS: number, TOP_SUGGESTION: number}}
     */
    static get MASS_INFO_SELL_BUY() {
        return {
            NOTHING: 0,
            TOP_50_SUGGESTIONS: 1,
            TOP_SUGGESTION: 2
        };
    };

    /**
     * Available types of 'HISTORY' param in 'MassInfo' request
     *
     * @returns {{NOTHING: number, LAST_100_SELLS: number, LAST_10_SELLS: number}}
     */
    static get MASS_INFO_HISTORY() {
        return {
            NOTHING: 0,
            LAST_100_SELLS: 1,
            LAST_10_SELLS: 2
        };
    };

    /**
     * Available types of 'INFO' param in `MassInfo` request
     *
     * @returns {{NOTHING: number, BASE: number, EXTENDED: number, MAXIMUM: number}}
     */
    static get MASS_INFO_INFO() {
        return {
            NOTHING: 0,
            BASE: 1,
            EXTENDED: 2,
            MAXIMUM: 3
        };
    };

    /**
     * Default params that will be substituted, when you did not provide some of them
     *
     * @returns {{sell: number, buy: number, history: number, info: number}}
     */
    static get DEFAULT_MASS_INFO_PARAMS() {
        return {
            sell: this.MASS_INFO_SELL_BUY.NOTHING,
            buy: this.MASS_INFO_SELL_BUY.NOTHING,
            history: this.MASS_INFO_HISTORY.NOTHING,
            info: this.MASS_INFO_INFO.BASE
        };
    };

    /**
     * Available types of `sellCreateTradeRequest` method
     *
     * @returns {{IN: string, OUT: string}}
     */
    static get CREATE_TRADE_REQUEST_TYPE() {
        return {
            IN: 'in',
            OUT: 'out'
        };
    };

    /**
     * @param {Object} options
     *
     * @property {String}  options.apiKey=false API key (required)
     * @property {String}  [options.baseUrl='https://market.csgo.com/'] Base url with trailing slash
     * @property {String}  [options.apiPath='api'] Relative path to api
     * @property {Boolean} [options.useLimiter=true] Using request limiter
     * @property {Boolean} [options.extendedError=false] Should module return full response and got options on market error
     * @property {Object}  [options.defaultGotOptions={}] Default parameters for 'got' module
     * @property {Object}  [options.gotOptions={}] Persistent parameters for 'got' module
     * @property {Object}  [options.limiterOptions={}] Parameters for 'bottleneck' module
     *
     * @throws {MarketApiError}
     */
    constructor(options = {}) {
        if(!options.apiKey) {
            throw new MarketApiError('API key required');
        }
        let self = this.constructor;

        // Adds trailing slash
        if(options.baseUrl) {
            if(!options.baseUrl.endsWith('/')) {
                options.baseUrl += '/';
            }
        }

        this.options = merge.recursive({
            baseUrl: self.defaultBaseUrl,
            apiPath: 'api',
            useLimiter: true,
            extendedError: false,
            limiterOptions: {
                maxConcurrent: 1, // 1 request at time
                minTime: 200,  // Max 5 requests per seconds
                highWater: null,
                strategy: Bottleneck.strategy.LEAK,
                rejectOnDrop: true
            },
            gotOptions: {},
            defaultGotOptions: {}
        }, options);

        /**
         *  CSGO.TM API has a limit of 5 requests per second.
         *  If you violate this restriction, your API key will become invalid
         */
        if(this.options.useLimiter) {
            this.limiter = new Bottleneck(this.options.limiterOptions);
        }
    }

    /**
     * Get API url
     *
     * @returns {string}
     */
    get apiUrl() {
        return this.options.baseUrl + this.options.apiPath;
    }

    /**
     * JSON request
     *
     * @param {String} url
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    static requestJSON(url, gotOptions = null) {
        gotOptions = gotOptions ? merge.clone(gotOptions) : {};
        gotOptions.responseType = 'json';

        return got(url, gotOptions).then(response => {
            let body = response.body;

            if(body.error) {
                let errorMessage = String(body.error);
                if(body.result) {
                    errorMessage += `. ${body.result}`;
                }

                let error = new MarketApiError(errorMessage);
                error.requestedUrl = url;
                error.response = response;
                error.gotOptions = gotOptions;

                throw error;
            } else {
                return body;
            }
        });
    }

    /**
     *
     * @param {String|Array} params Parameters that forms API call
     * @param {Boolean} [disableProcessing=false] Show we skip handling empty and non-string values
     * @return {String}
     */
    static formatApiCall(params, disableProcessing = false) {
        if(!Array.isArray(params)) {
            params = [params];
        }

        if(!disableProcessing) {
            params = params.filter((p) => !!p).map((p) => String(p));

            if(params.length === 0) {
                throw new MarketApiError('Api call params should contain at least 1 param');
            }
        }

        return params.join('/');
    }

    /**
     * Formats some price value
     *
     * @param {Number|String} cents
     * @return {String}
     */
    static formatPrice(cents) {
        return String(parseInt(cents)) || String(NaN);
    }

    /**
     * Formal way to get steam item ids
     *
     * @param {Object} item Item object that you got from API, or you have created by yourself
     * @param {Boolean} [asNumbers] Should we convert ids to numbers?
     *
     * @returns {{classId: string, instanceId: string}}
     */
    static getItemIds(item, asNumbers = false) {
        let ids = {
            classId: String(item.i_classid || item.classid || item.classId),
            instanceId: String(item.i_instanceid || item.instanceid || item.instanceId || 0),
        };
        if(ids.instanceId === '0' && item.ui_real_instance) {
            ids.instanceId = String(item.ui_real_instance);
        }

        if(!asNumbers) {
            return ids;
        } else {
            return {
                classId: Number(ids.classId),
                instanceId: Number(ids.instanceId),
            };
        }
    }

    /**
     * Formal way to get item market_hash_name
     *
     * @param {Object|String} item - Item object that you got from API, or you have created by yourself
     *
     * @returns {String}
     */
    static getItemHash(item) {
        if(typeof item === 'string') {
            return item;
        }

        return item.market_hash_name || item.market_name || item.hashName;
    }

    /**
     * Format item to needed query string
     *
     * @param {Object} item Item object that you got from API, or you have created by yourself
     * @param {String} [symbol] Separator
     *
     * @returns {string}
     */
    static formatItem(item, symbol = '_') {
        let ids = this.getItemIds(item);

        return ids.classId + symbol + ids.instanceId;
    }

    /**
     * Limit requests, if need
     *
     * @param {Function} callback returning {Promise}
     *
     * @returns {Promise}
     */
    limitRequest(callback) {
        if(this.options.useLimiter) {
            return this.limiter.schedule(callback);
        } else {
            return callback();
        }
    }

    /**
     * Simple API call with key
     *
     * @param {String|Array} method - method to be called
     * @param {Object} [gotOptions] Options for 'got' module
     * @param {Object} [params] - optional params that may want to pass in url
     *
     * @returns {Promise}
     */
    callMethodWithKey(method, gotOptions = null, params = null) {
        let url = this.formatMethodWithKey(method, params);

        return this.callApiUrl(url, gotOptions);
    }

    /**
     * @param {String|Array} method
     * @param {Object} [params] - optional params that may want to pass in url
     *
     * @return {String}
     */
    formatMethodWithKey(method, params = null) {
        let self = this.constructor;

        let completeOptions = merge.recursive({
            key: this.options.apiKey,
        }, params);

        let methodPath = encodeURI(self.formatApiCall(method));
        let queryParams = queryStringify(completeOptions);

        return `${this.apiUrl}/${methodPath}/?${queryParams}`;
    }

    /**
     * Non-static hook for API calls with JSON response
     * @param url
     * @param gotOptions
     */
    requestJsonHook(url, gotOptions = null) {
        let self = this.constructor;

        return self.requestJSON(url, gotOptions);
    }

    /**
     * Non-static hook for API calls with generic response
     * @param url
     * @param gotOptions
     */
    requestHook(url, gotOptions = null) {
        return got(url, gotOptions);
    }

    /**
     * @param {String} url - complete url to call
     * @param {Object} [gotOptions] - options for 'got' module
     *
     * @return {Promise}
     */
    callApiUrl(url, gotOptions = null) {
        let optionsClone = this.makeGotOptions(gotOptions);

        return this.limitRequest(() => {
            return this.requestJsonHook(url, optionsClone).catch((error) => {
                if(!this.options.extendedError) {
                    delete (error.response, error.gotOptions);
                }

                throw error;
            });
        });
    }

    /**
     * API call for some POSt method
     *
     * @param {String|Array} method
     * @param {Object} [postData]
     * @param {Object} [gotOptions] Options for 'got' module
     * @param {Object} [params] - optional params that may want to pass in url
     *
     * @returns {Promise}
     */
    callPostMethodWithKey(method, postData = {}, gotOptions = null, params = null) {
        let optionsClone = this.makeGotOptions(gotOptions);

        let preparedOptions = merge.recursive(optionsClone, {
            form: true,
            body: postData,
        });

        return this.callMethodWithKey(method, preparedOptions, params);
    }

    /**
     * Internal formatter for got module options
     *
     * @param {Object} opts
     * @return {Object}
     */
    makeGotOptions(opts) {
        if(!opts) {
            opts = this.options.defaultGotOptions;
        }

        return merge.recursive(true, this.options.gotOptions, opts);
    }

    /**
     * Simple API call with added item url
     *
     * @param {Object} item
     * @param {String} method
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    callItemMethod(item, method, gotOptions = null) {
        let self = this.constructor;
        let url = [method, self.formatItem(item)];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * -------------------------------------
     * Static API call that don't require key
     * -------------------------------------
     */

    /**
     * Get current item DB name
     *
     * @param {Number} [appId] Steam app id that we want to get
     * @param {String} [baseUrl] Market base url
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    dbName(appId = this.constructor.defaultAppId, baseUrl = this.constructor.defaultBaseUrl, gotOptions = null) {
        let url = `${baseUrl}itemdb/current_${appId}.json`;

        return this.requestJsonHook(url, gotOptions);
    }

    /**
     * Get current database file data
     *
     * @param {String} dbName
     * @param {String} [baseUrl] Market base url
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    itemDb(dbName, baseUrl = this.constructor.defaultBaseUrl, gotOptions = null) {
        let url = `${baseUrl}itemdb/${dbName}`;

        return this.requestHook(url, gotOptions).then((response) => {
            let parsed = Papa.parse(response.body, {
                header: true,
                trimHeader: true,
                delimiter: ';',
                encoding: 'utf8',
                skipEmptyLines: true,
            });

            if(parsed.errors.length) {
                throw parsed.errors;
            }

            return parsed.data;
        });
    }

    /**
     * Gets current item DB from CSGO.TM
     *
     * @param {Number} [appId] Steam app id that we want to get
     * @param {String} [baseUrl] Market base url
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    currentItemDb(appId = this.constructor.defaultAppId, baseUrl = this.constructor.defaultBaseUrl, gotOptions = null) {
        return this.dbName(appId, baseUrl, gotOptions).then((data) => {
            return this.itemDb(data.db, baseUrl, gotOptions);
        });
    }

    /**
     * Get list of the last 50 purchases
     *
     * @param {String} [baseUrl] Market base url
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    history(baseUrl = this.constructor.defaultBaseUrl, gotOptions = null) {
        let url = `${baseUrl}history/json/`;

        return this.requestJsonHook(url, gotOptions);
    }

    /**
     * -------------------------------------
     * Account methods
     * -------------------------------------
     */

    /**
     * Getting the Steam inventory, only those items that you have not already put up for sale
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetSteamInventory(gotOptions = null) {
        return this.callMethodWithKey('GetInv', gotOptions);
    }

    /**
     * Getting the info about items in trades
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetTrades(gotOptions = null) {
        return this.callMethodWithKey('Trades', gotOptions);
    }

    /**
     * Get account balance
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetMoney(gotOptions = null) {
        return this.callMethodWithKey('GetMoney', gotOptions);
    }

    /**
     * Ping that you in online
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountPingPong(gotOptions = null) {
        return this.callMethodWithKey('PingPong', gotOptions);
    }

    /**
     * Stop your trades
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGoOffline(gotOptions = null) {
        return this.callMethodWithKey('GoOffline', gotOptions);
    }

    /**
     * Set token
     *
     * @param {String} token from steam trade url
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountSetToken(token, gotOptions = null) {
        let url = ['SetToken', String(token)];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Get token
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetToken(gotOptions = null) {
        return this.callMethodWithKey('GetToken', gotOptions);
    }

    /**
     * Get key for auth on websockets
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetWSAuth(gotOptions = null) {
        return this.callMethodWithKey('GetWSAuth', gotOptions);
    }

    /**
     * Update cache of steam inventory
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountUpdateInventory(gotOptions = null) {
        return this.callMethodWithKey('UpdateInventory', gotOptions);
    }

    /**
     * Getting cache status of inventory
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetCacheInfoInventory(gotOptions = null) {
        return this.callMethodWithKey('InventoryItems', gotOptions);
    }

    /**
     * Getting operation history of period
     *
     * @param {Date} from
     * @param {Date} to
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetOperationHistory(from, to, gotOptions = null) {
        let fromUnixtime = Math.floor(from.getTime() / 1000);
        let toUnixtime = Math.floor(to.getTime() / 1000);

        let url = ['OperationHistory', fromUnixtime, toUnixtime];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Getting discounts
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetDiscounts(gotOptions = null) {
        return this.callMethodWithKey('GetDiscounts', gotOptions);
    }

    /**
     * Getting counters from https://market.csgo.com/sell/
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetCounters(gotOptions = null) {
        return this.callMethodWithKey('GetCounters', gotOptions);
    }

    /**
     * Getting items of profile with hash
     *
     * @param {String} hash
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetProfileItems(hash, gotOptions = null) {
        return this.callMethodWithKey('GetProfileItems', gotOptions);
    }

    /**
     * Getting items from sell offers
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetItemsSellOffers(gotOptions = null) {
        return this.callMethodWithKey('GetMySellOffers', gotOptions);
    }

    /**
     * Get a list of items that have been sold and must be passed to the market bot using the ItemRequest method.
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetItemsToGive(gotOptions = null) {
        return this.callMethodWithKey('GetItemsToGive', gotOptions);
    }


    /**
     * -------------------------------------
     * Items methods
     * -------------------------------------
     */

    /**
     * Get item info
     *
     * @param {Object} item
     * @param {String} [language='ru'] One of static LANGUAGES
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetInfo(item, language, gotOptions = null) {
        let self = this.constructor;
        language = language || self.LANGUAGES.RU;

        let url = ['ItemInfo', self.formatItem(item), language];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Get item history
     *
     * @param {Object} item
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetHistory(item, gotOptions = null) {
        return this.callItemMethod(item, 'ItemHistory', gotOptions);
    }

    /**
     * Get item hash of 'Float Value'
     *
     * @param {Object} item
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetFloatHash(item, gotOptions = null) {
        return this.callItemMethod(item, 'GetFloatHash', gotOptions);
    }

    /**
     * Get item sell offers
     *
     * @param {Object} item
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetSellOffers(item, gotOptions = null) {
        return this.callItemMethod(item, 'SellOffers', gotOptions);
    }

    /**
     * Get item bet sell offer
     *
     * @param {Object} item
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetBestSellOffer(item, gotOptions = null) {
        return this.callItemMethod(item, 'BestSellOffer', gotOptions);
    }

    /**
     * Get item buy offers
     *
     * @param {Object} item
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetBuyOffers(item, gotOptions = null) {
        return this.callItemMethod(item, 'BuyOffers', gotOptions);
    }

    /**
     * Get item best buy offer
     *
     * @param {Object} item
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetBestBuyOffer(item, gotOptions = null) {
        return this.callItemMethod(item, 'BestBuyOffer', gotOptions);
    }

    /**
     * Get item description for method 'buy'
     *
     * @param {Object} item
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetDescription(item, gotOptions = null) {
        return this.callItemMethod(item, 'GetItemDescription', gotOptions);
    }

    /**
     * Getting more info about item
     *
     * @param {Array|Object} items One item or array of items
     * @param {Object} [params] Request params
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    itemMassInfo(items, params = {}, gotOptions = null) {
        let self = this.constructor;
        // [SELL], [BUY], [HISTORY], [INFO]
        let url = 'MassInfo/%s/%s/%s/%s';

        if(!Array.isArray(items)) {
            items = [items];
        }

        params = Object.assign({}, self.DEFAULT_MASS_INFO_PARAMS, params);

        url = util.format(url,
            params.sell,
            params.buy,
            params.history,
            params.info
        );

        let list = [];
        items.forEach(item => {
            list.push(self.formatItem(item));
        });

        return this.callPostMethodWithKey(url, {list: list.toString()}, gotOptions);
    }

    /**
     * -------------------------------------
     * Sell methods
     * -------------------------------------
     */

    /**
     * Creating new sell
     *
     * @param {Object} item Object with instance_id and class_id
     * @param {Number} price Price in cents
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    sellCreate(item, price, gotOptions = null) {
        let self = this.constructor;
        let url = ['SetPrice', `new_${self.formatItem(item)}`, self.formatPrice(price)];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Creating new sell of concrete item
     *
     * @param {Object} assetId Steam assetid of item in your inventory
     * @param {Number} price Price in cents
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    sellCreateAsset(assetId, price, gotOptions = null) {
        let self = this.constructor;
        let url = ['SetPrice', `new_asset_${assetId}`, self.formatPrice(price)];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Updating price of sell
     *
     * @param {String} itemId Item ui_id from 'accountGetTrades' method
     * @param {Number} price Price in cents
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    sellUpdatePrice(itemId, price, gotOptions = null) {
        let self = this.constructor;
        let url = ['SetPrice', itemId, self.formatPrice(price)];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Remove sell from market
     *
     * @param {String} itemId Item ui_id from 'accountGetTrades' method
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    sellRemove(itemId, gotOptions = null) {
        return this.sellUpdatePrice(itemId, 0, gotOptions);
    }

    /**
     * Create trade request
     *
     * @param {String} botId Bot ui_bid from 'accountGetTrades' method (with ui_status = 4)
     * @param {String} type CREATE_TRADE_REQUEST_TYPE type
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    sellCreateTradeRequest(botId, type = 'out', gotOptions = null) {
        let self = this.constructor;

        let types = self.CREATE_TRADE_REQUEST_TYPE;
        let typeUpper = type.toUpperCase();
        if(!types.hasOwnProperty(typeUpper)) {
            type = types.OUT;
        } else {
            type = types[typeUpper];
        }

        let url = ['ItemRequest', type, botId];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Getting market trades
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    sellGetMarketTrades(gotOptions = null) {
        return this.callMethodWithKey('MarketTrades', gotOptions);
    }

    /**
     * Massive update prices
     *
     * @param {Object} item Item object with claasid and instanceid or with market_hash_name
     * @param {Number} price
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    sellMassUpdatePrice(item, price, gotOptions = null) {
        let self = this.constructor;
        let name;
        try {
            name = self.formatItem(item);
        } catch(e) {
            name = self.getItemHash(item);
        }

        let url = ['MassSetPrice', name, self.formatPrice(price)];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Massive update prices by item id
     *
     * @param {Object} prices Object with item ui_id as a key and its new price as value
     * @param {Object} [gotOptions]
     * @todo: untested
     *
     * @return {Promise}
     */
    sellMassUpdatePriceById(prices, gotOptions = null) {
        let list = {};
        for(let ui_id in prices) {
            list[Number(ui_id)] = Number(prices[ui_id]);
        }

        return this.callPostMethodWithKey('MassSetPriceById', list, gotOptions);
    }

    /**
     * -------------------------------------
     * Buy methods
     * -------------------------------------
     */

    /**
     * Creating new buy
     *
     * @param {Object} item - May have hash property
     * @param {Number} price - Price to buy on
     * @param {?Object} [tradeData=null] - Trade data of account that you want to send to
     * @param {String|Number} [tradeData.partnerId]
     * @param {String} [tradeData.tradeToken]
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    buyCreate(item, price, tradeData = null, gotOptions = null) {
        let self = this.constructor;
        let method = ['Buy', self.formatItem(item), self.formatPrice(price), item.hash];

        let _partnerData = null;
        if(tradeData && tradeData.partnerId && tradeData.tradeToken) {
            _partnerData = {
                partner: tradeData.partnerId,
                token: tradeData.tradeToken,
            };
        }

        return this.callMethodWithKey(method, gotOptions, _partnerData);
    }

    /**
     * -------------------------------------
     * Order methods
     * -------------------------------------
     */

    /**
     * Getting list of orders
     *
     * @param {Number} page For pagination
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    orderGetList(page = null, gotOptions = null) {
        let url = ['GetOrders'];

        page = parseInt(page);
        if(!isNaN(page) && page > 0) {
            url.push(page);
        }

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Creating new order
     *
     * @param {Object} item
     * @param {Number} price
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    orderCreate(item, price, gotOptions = null) {
        let self = this.constructor;
        let url = ['InsertOrder', self.formatItem(item, '/'), self.formatPrice(price), item.hash];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Updating or removing order. If price = 0, then order will be removed, else updated
     *
     * @param {Object} item
     * @param {Number} price
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    orderUpdateOrRemove(item, price, gotOptions = null) {
        let self = this.constructor;
        let url = ['UpdateOrder', self.formatItem(item, '/'), self.formatPrice(price)];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Create, Update or Remove order
     *
     * @param {Object} item
     * @param {Number} price
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    orderProcess(item, price, gotOptions = null) {
        let self = this.constructor;
        let url = ['ProcessOrder', self.formatItem(item, '/'), self.formatPrice(price)];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * Deleting all orders
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    orderDeleteAll(gotOptions = null) {
        return this.callMethodWithKey('DeleteOrders', gotOptions);
    }

    /**
     * Getting status of order system
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    orderSystemStatus(gotOptions = null) {
        return this.callMethodWithKey('StatusOrders', gotOptions);
    }

    /**
     * Getting the last 100 orders
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    orderGetLog(gotOptions = null) {
        return this.callMethodWithKey('GetOrdersLog', gotOptions);
    }

    /**
     * -------------------------------------
     * Notification methods
     * -------------------------------------
     */

    /**
     * Getting notification
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    notificationGet(gotOptions = null) {
        return this.callMethodWithKey('GetNotifications', gotOptions);
    }

    /**
     * Update or remove notification.
     *
     * @param {Object} item
     * @param {Number} price
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    notificationProcess(item, price, gotOptions = null) {
        let self = this.constructor;
        let url = ['UpdateNotification', self.formatItem(item, '/'), self.formatPrice(price)];

        return this.callMethodWithKey(url, gotOptions);
    }

    /**
     * -------------------------------------
     * Searching methods
     * -------------------------------------
     */

    /**
     * Searching items by names
     *
     * @param {Array|Object} items One item or array of items with market_hash_name properties
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    searchItemsByName(items, gotOptions = null) {
        let self = this.constructor;
        if(!Array.isArray(items)) {
            items = [items];
        }

        let body = {};
        items.forEach((item, i) => {
            body[`list[${i}]`] = self.getItemHash(item);
        });

        return this.callPostMethodWithKey('MassSearchItemByName', body, gotOptions);
    }

    /**
     * Searching one item by hash name
     *
     * @param {Object|String} item Item object that you got from API or created by yourself, or just item market hash name
     * @property {String} item.market_hash_name Item market hash name
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    searchItemByName(item, gotOptions = null) {
        let self = this.constructor;
        let mhn = self.getItemHash(item);

        return this.callMethodWithKey(['SearchItemByName', mhn], gotOptions);
    }

    /**
     * -------------------------------------
     * Quick buy methods
     * -------------------------------------
     */

    /**
     * Getting list of available items for quick buy
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    quickGetItems(gotOptions = null) {
        return this.callMethodWithKey('QuickItems', gotOptions);
    }

    /**
     * Quick buy item
     *
     * @param {String} itemId Item ui_id from 'accountGetTrades' method
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    quickBuy(itemId, gotOptions = null) {
        return this.callMethodWithKey(['QuickBuy', itemId], gotOptions);
    }

    /**
     * -------------------------------------
     * Additional methods
     * -------------------------------------
     */

    /**
     * Getting all stickers
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    additionalGetStickers(gotOptions = null) {
        return this.callMethodWithKey('GetStickers', gotOptions);
    }

    /**
     * Test trades possibility
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    additionalTest(gotOptions = null) {
        return this.callMethodWithKey('Test', gotOptions);
    }

    /**
     * Getting the last messages
     *
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    additionalGetChatLog(gotOptions = null) {
        return this.callMethodWithKey('GetChatLog', gotOptions);
    }

    /**
     * Getting the status of bot
     *
     * @param {String} botId Bot ui_bid from 'accountGetTrades' method
     * @param {Object} [gotOptions] Options for 'got' module
     *
     * @returns {Promise}
     */
    additionalCheckBotStatus(botId, gotOptions = null) {
        return this.callMethodWithKey(['CheckBotStatus', botId], gotOptions);
    }
}

module.exports = MarketApi;
