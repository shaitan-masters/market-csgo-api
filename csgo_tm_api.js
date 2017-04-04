"use strict";

var got = require('got'),
    util = require('util'),
    extend = require('extend'),
    Bottleneck = require("bottleneck"),
    parseCSV = require('csv-parse');

/**
 * API error
 */
class CSGOtmAPIError extends Error{
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}


/**
 * API
 * https://csgo.tm/docs/
 */
class CSGOtmAPI {
    /**
     * @param {Object} options
     *
     * {String}     [options.apiKey=false] API key (required)
     * {Boolean}    [options.useLimiter=true] using request limiter
     * {Object}     [options.limiterOptions={}] parameters for 'bottleneck' module
     *
     * @throws {CSGOtmAPIError}
     */
    constructor (options) {
        options = options || {};
        if (!options.apiKey) {
            throw new CSGOtmAPIError('API key required');
        }

        this.options = {};
        extend(this.options, options, {
            useLimiter: true,
            limiterOptions: {
                concurrent: 1, // 1 request at time
                minTime: 250,  // Max 5 requests per seconds
                highWater: -1,
                strategy: Bottleneck.strategy.LEAK,
                rejectOnDrop: true
            }
        });

        this.baseURI = 'https://market.csgo.com/api/';
        this.availableLanguages = ['en', 'ru'];

        /**
         *  CSGO.TM API has a limit of 5 requests per second.
         *  If you violate this restriction, your API key will become invalid
         */
        if (this.options.useLimiter) {
            let limiterOptions = this.options.limiterOptions;
            this.limiter = new Bottleneck(
                limiterOptions.concurrent,
                limiterOptions.minTime,
                limiterOptions.highWater,
                limiterOptions.strategy,
                limiterOptions.rejectOnDrop
            );
        }
    }

    /**
     * JSON request
     *
     * @param url
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    static requestJSON(url, gotOptions) {
        gotOptions = gotOptions || {};
        gotOptions.json = true;

        return new Promise((resolve, reject) => {
            got(url, gotOptions).then(response => {
                let body = response.body;
                if (body.error) {
                    throw new CSGOtmAPIError(body.error);
                }
                else {
                    resolve(body);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * Get current database file information
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    static itemDbCurrent(gotOptions) {
        let url = 'https://market.csgo.com/itemdb/current_730.json';
        return CSGOtmAPI.requestJSON(url, gotOptions);
    }

    /**
     * Get current database file data
     *
     * @param {String} dbName
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    static itemDb(dbName, gotOptions) {
        let url = 'https://market.csgo.com/itemdb/' + dbName;
        return new Promise((resolve, reject) => {
            got(url, gotOptions).then(response => {
                parseCSV(
                    response.body,
                    {
                        columns: true,
                        delimiter: ';'
                    },
                    function(err, data){
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(data);
                        }
                    }
                );
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * Get list of the last 50 purchases
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    static history(gotOptions) {
        let url = 'https://market.csgo.com/history/json/';
        return CSGOtmAPI.requestJSON(url, gotOptions);
    }

    /**
     * Limit requests, if need
     *
     * @param {Function} callback returning {Promise}
     *
     * @returns {Promise}
     */
    limitRequest(callback) {
        if (this.options.useLimiter) {
            return this.limiter.schedule(callback);
        }
        else {
            return callback();
        }
    }

    /**
     * -------------------------------------
     * Account methods
     * -------------------------------------
     */


    /**
     * Getting the Steam inventory, only those items that you have not already put up for sale
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetSteamInventory(gotOptions) {
        let url = this.baseURI + '/GetInv/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Getting the info about items in trades
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetTrades(gotOptions) {
        let url = this.baseURI + '/Trades/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Get account balance
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetMoney(gotOptions) {
        let url = this.baseURI + '/GetMoney/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Ping that you in online
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountPingPong(gotOptions) {
        let url = this.baseURI + '/PingPong/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Stop your trades
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGoOffline(gotOptions) {
        let url = this.baseURI + '/GoOffline/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Set token
     *
     * @param {String} token from steam trade url
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountSetToken(token, gotOptions) {
        let url = this.baseURI + '/SetToken/%s/?key=%s';
        url = util.format(url, token, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Get token
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetToken(gotOptions) {
        let url = this.baseURI + '/GetToken/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Get key for auth on websockets
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetWSAuth(gotOptions) {
        let url = this.baseURI + '/GetWSAuth/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Update cache of steam inventory
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountUpdateInventory(gotOptions) {
        let url = this.baseURI + '/UpdateInventory/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Getting cache status of inventory
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetCacheInfoInventory(gotOptions) {
        let url = this.baseURI + '/InventoryItems/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Getting operation history of period
     *
     * @param {Date} from
     * @param {Date} to
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetOperationHistory(from, to, gotOptions) {
        let url = this.baseURI + '/OperationHistory/%s/%s/?key=%s';
        let fromUnixtime = Math.floor(from.getTime() / 1000);
        let toUnixtime = Math.floor(to.getTime() / 1000);

        url = util.format(url, fromUnixtime, toUnixtime, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Getting discounts
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetDiscounts(gotOptions) {
        let url = this.baseURI + '/GetDiscounts/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Getting counters from https://market.csgo.com/sell/
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetCounters(gotOptions) {
        let url = this.baseURI + '/GetCounters/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Getting items of profile with hash
     *
     * @param {String} hash
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetProfileItems(hash, gotOptions) {
        let url = this.baseURI + '/GetProfileItems/%s/?key=%s';
        url = util.format(url, hash, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Getting items from sell offers
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetItemsSellOffers(gotOptions) {
        let url = this.baseURI + '/GetMySellOffers/%s/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
    }

    /**
     * Get a list of items that have been sold and must be passed to the market bot using the ItemRequest method.
     *
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    accountGetItemsToGive(gotOptions) {
        let url = this.baseURI + '/GetItemsToGive/%s/?key=%s';
        url = util.format(url, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions);
        });
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
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetInfo(item, gotOptions) {
        let url = this.baseURI + '/ItemInfo/%s_%s/%s/?key=%s';
        item = item || {};
        item.language = item.language || 'en';

        if (this.availableLanguages.indexOf(item.language) === -1) {
            item.language = this.availableLanguages[0];
        }

        url = util.format(url, item.classId, item.instanceId, item.language, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions)
        });
    }

    /**
     * Get item history
     *
     * @param {Object} item
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetHistory(item, gotOptions) {
        let url = this.baseURI + '/ItemHistory/%s_%s/?key=%s';
        item = item || {};
        url = util.format(url, item.classId, item.instanceId, item.language, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions)
        });
    }

    /**
     * Get item hash of 'Float Value'
     *
     * @param {Object} item
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetFloatHash(item, gotOptions) {
        let url = this.baseURI + '/GetFloatHash/%s_%s/?key=%s';
        item = item || {};
        url = util.format(url, item.classId, item.instanceId, item.language, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions)
        });
    }

    /**
     * Get item sell offers
     *
     * @param {Object} item
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetSellOffers(item, gotOptions) {
        let url = this.baseURI + '/SellOffers/%s_%s/?key=%s';
        item = item || {};
        url = util.format(url, item.classId, item.instanceId, item.language, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions)
        });
    }

    /**
     * Get item bet sell offer
     *
     * @param {Object} item
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetBestSellOffer(item, gotOptions) {
        let url = this.baseURI + '/BestSellOffer/%s_%s/?key=%s';
        item = item || {};
        url = util.format(url, item.classId, item.instanceId, item.language, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions)
        });
    }

    /**
     * Get item buy offers
     *
     * @param {Object} item
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetBuyOffers(item, gotOptions) {
        let url = this.baseURI + '/BuyOffers/%s_%s/?key=%s';
        item = item || {};
        url = util.format(url, item.classId, item.instanceId, item.language, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions)
        });
    }

    /**
     * Get item best buy offer
     *
     * @param {Object} item
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetBestBuyOffer(item, gotOptions) {
        let url = this.baseURI + '/BestBuyOffer/%s_%s/?key=%s';
        item = item || {};
        url = util.format(url, item.classId, item.instanceId, item.language, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions)
        });
    }

    /**
     * Get item description for method 'buy'
     *
     * @param {Object} item
     * @param {Object} gotOptions options for 'got' module
     *
     * @returns {Promise}
     */
    itemGetDescription(item, gotOptions) {
        let url = this.baseURI + '/GetItemDescription/%s_%s/?key=%s';
        item = item || {};
        url = util.format(url, item.classId, item.instanceId, item.language, this.options.apiKey);
        return this.limitRequest(() => {
            return CSGOtmAPI.requestJSON(url, gotOptions)
        });
    }
}

module.exports.API = CSGOtmAPI;
module.exports.CSGOtmAPIError = CSGOtmAPIError;


