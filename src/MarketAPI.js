const Bottleneck = require('bottleneck');
const {
    validateInitOptions, validateRequestParams
} = require('./../helpers');

const {
    limiterOptions: LIMITER_OPTIONS, defaultAPIParams: DEFAULT_API_PARAMS
} = require('./../enums');
const ErrorEmitter = require('@ErrorEmitter');
const GET_METHOD_DATA = require('./../API/v/helpers/get_method_data');
const FETCH_API = require('./../API/fetch');
const BUILD_REQUEST_PARAMS = require('./../helpers/build_request_params');
const STATE = {};

module.exports = class MarketAPI {
    /**
     *
     * @param {Object} initOptions - take options and create state
     */
    constructor(initOptions = {}) {
        /**
         * Validate init options with Joi.
         * No args or false value will be assigned to an object
         */
        validateInitOptions(initOptions);

        /**
         *
         * @type {Object} get API params from init options
         */
        const {APIParams: API_PARAMS = {}} = initOptions;

        /**
         * Create independent state from passed options argument
         */
        this.state = {
            /**
             * Init options are passed as is
             */
            ...initOptions, /**
             *  Check if client would like to get Market API errors as JSON w/o throwing
             *  Default is false
             */
            APIErrorsToJSON: !!initOptions.APIErrorsToJSON,

            /**
             * Check if client would like to get warnings
             */
            getWarnings: !!initOptions.getWarnings,

            /**
             * Limiter options be always used cause the limit 5 requests/sec seems to stay for a long time (14.04.2021)
             */
            limiter: new Bottleneck(LIMITER_OPTIONS), /**
             * Marketplace API key
             */
            APIKey: initOptions.APIKey, /**
             * Params to be used during API calls
             */
            APIParams: {
                /**
                 * Save currency  and use it if the client won't pass this param in functions calls. Default is USD
                 */
                currency: API_PARAMS.currency || DEFAULT_API_PARAMS.currency, /**
                 /**
                 * Save language  and use it if the client won't pass this param in functions calls. Default is en
                 */
                language: API_PARAMS.language || DEFAULT_API_PARAMS.language,

                /**
                 * App id being used in the filename of DB json. Can be passed in the method getDBName by the client
                 */
                marketAppId: API_PARAMS.marketAppId || DEFAULT_API_PARAMS.APIKey,

            },

        };
        /**
         *
         * @type {Function} - bind class builder to this
         */
        this.buildMethod = this.buildMethod.bind(this);
    }

    /**
     * Allows to call APIProvder.v1.someMethod()
     * @returns {{operationHistory: (function(*=): *), itemRequest: (function(*=): *), getDBData: (function(*=): *), getProfileItems: (function(*=): *), insertOrder: (function(*=): *), getWSAuth: (function(*=): *), updateNotification: (function(*=): *), updateOrder: (function(*=): *), itemInfo: (function(*=): *), setPrice: (function(*=): *), getOrders: (function(*=): *), getDBFileName: (function(*=): *), processOrder: (function(*=): *), getMassInfo: (function(*=): *), getHistory: (function(*=): *), setToken: (function(*=): *), massSetPrice: (function(*=): *), getFloatHash: (function(*=): *)}}
     */
    get v1() {
        return {
            setToken: reqParams => this.buildMethod.call(this, 'v1', 'setToken')(reqParams),
            operationHistory: reqParams => this.buildMethod.call(this, 'v1', 'operationHistory')(reqParams),
            getProfileItems: reqParams => this.buildMethod.call(this, 'v1', 'getProfileItems')(reqParams),
            itemInfo: reqParams => this.buildMethod.call(this, 'v1', 'itemInfo')(reqParams),
            setPrice: reqParams => this.buildMethod.call(this, 'v1', 'setPrice')(reqParams),
            itemRequest: reqParams => this.buildMethod.call(this, 'v1', 'itemRequest')(reqParams),
            massSetPrice: reqParams => this.buildMethod.call(this, 'v1', 'massSetPrice')(reqParams),
            getOrders: reqParams => this.buildMethod.call(this, 'v1', 'getOrders')(reqParams),
            insertOrder: reqParams => this.buildMethod.call(this, 'v1', 'insertOrder')(reqParams),
            updateOrder: reqParams => this.buildMethod.call(this, 'v1', 'updateOrder')(reqParams),
            processOrder: reqParams => this.buildMethod.call(this, 'v1', 'processOrder')(reqParams),
            updateNotification: reqParams => this.buildMethod.call(this, 'v1', 'updateNotification')(reqParams),
            getMassInfo: reqParams => this.buildMethod.call(this, 'v1', 'getMassInfo')(reqParams),
            getFloatHash: reqParams => this.buildMethod.call(this, 'v1', 'getFloatHash')(reqParams),
            getWSAuth: reqParams => this.buildMethod.call(this, 'v1', 'getWSAuth')(reqParams),
            getDBFileName: reqParams => this.buildMethod.call(this, 'v1', 'getDBFileName')(reqParams),
            getDBData: reqParams => this.buildMethod.call(this, 'v1', 'getDBData')(reqParams),
            getHistory: reqParams => this.buildMethod.call(this, 'v1', 'getHistory')(reqParams)
        };
    }

    /**
     * Allows to call APIProvder.v2.someMethod()
     * @returns {{operationHistory: (function(*=): *), itemRequest: (function(*=): *), getDBData: (function(*=): *), getProfileItems: (function(*=): *), insertOrder: (function(*=): *), getWSAuth: (function(*=): *), updateNotification: (function(*=): *), updateOrder: (function(*=): *), itemInfo: (function(*=): *), setPrice: (function(*=): *), getOrders: (function(*=): *), getDBFileName: (function(*=): *), processOrder: (function(*=): *), getMassInfo: (function(*=): *), getHistory: (function(*=): *), setToken: (function(*=): *), massSetPrice: (function(*=): *), getFloatHash: (function(*=): *)}}
     */
    get v2() {
        return {
            getMoney: reqParams => this.buildMethod.call(this, 'v2', 'getMoney')(reqParams),
            goOffline: reqParams => this.buildMethod.call(this, 'v2', 'goOffline')(reqParams),
            ping: reqParams => this.buildMethod.call(this, 'v2', 'ping')(reqParams),
            updateInventory: reqParams => this.buildMethod.call(this, 'v2', 'updateInventory')(reqParams),
            items: reqParams => this.buildMethod.call(this, 'v2', 'items')(reqParams),
            history: reqParams => this.buildMethod.call(this, 'v2', 'history')(reqParams),
            trades: reqParams => this.buildMethod.call(this, 'v2', 'trades')(reqParams),
            transferDiscounts: reqParams => this.buildMethod.call(this, 'v2', 'transferDiscounts')(reqParams),
            getMySteamId: reqParams => this.buildMethod.call(this, 'v2', 'getMySteamId')(reqParams),
            myInventory: reqParams => this.buildMethod.call(this, 'v2', 'myInventory')(reqParams),
            buy: reqParams => this.buildMethod.call(this, 'v2', 'buy')(reqParams),
            buyFor: reqParams => this.buildMethod.call(this, 'v2', 'buyFor')(reqParams),
            getBuyInfoByCustomId: reqParams => this.buildMethod.call(this, 'v2', 'getBuyInfoByCustomId')(reqParams),
            getListBuyInfoByCustomId: reqParams => this.buildMethod.call(this, 'v2', 'getListBuyInfoByCustomId')(reqParams),
            addToSale: reqParams => this.buildMethod.call(this, 'v2', 'addToSale')(reqParams),
            setPrice: reqParams => this.buildMethod.call(this, 'v2', 'setPrice')(reqParams),
            removeAllFromSale: reqParams => this.buildMethod.call(this, 'v2', 'removeAllFromSale')(reqParams),
            tradeRequestGive: reqParams => this.buildMethod.call(this, 'v2', 'tradeRequestGive')(reqParams),
            tradeRequestGiveP2p: reqParams => this.buildMethod.call(this, 'v2', 'tradeRequestGiveP2p')(reqParams),
            tradeRequestGiveP2pAll: reqParams => this.buildMethod.call(this, 'v2', 'tradeRequestGiveP2pAll')(reqParams),
            searchItemByHashName: reqParams => this.buildMethod.call(this, 'v2', 'searchItemByHashName')(reqParams),
            searchItemByHashNameSpecific: reqParams => this.buildMethod.call(this, 'v2', 'searchItemByHashNameSpecific')(reqParams),
            searchListItemsByHashNameAll: reqParams => this.buildMethod.call(this, 'v2', 'searchListItemsByHashNameAll')(reqParams),
            getListItemsInfo: reqParams => this.buildMethod.call(this, 'v2', 'getListItemsInfo')(reqParams),
            getWSAuth: reqParams => this.buildMethod.call(this, 'v2', 'getWSAuth')(reqParams),
            test: reqParams => this.buildMethod.call(this, 'v2', 'test')(reqParams),
            getPrices: reqParams => this.buildMethod.call(this, 'v2', 'getPrices')(reqParams),
            getPricesWithClassInstance: reqParams => this.buildMethod.call(this, 'v2', 'getPricesWithClassInstance')(reqParams)
        };
    }

    /**
     *
     * @param {any} customParam
     * @returns {Object} - returns init options and client's param to test class initialization
     */
    test(customParam) {
        return {
            ...this.initOptions, customParam,
        };
    }

    /**
     *
     * @param {String} version
     * @param {String} methodName
     * @returns {Function} - takes version and method name and returns a class method like APIProvider.v1.someMethod(reqParams)
     */
    buildMethod(version, methodName) {
        /**
         * Import method from method props object
         */
        const METHOD = GET_METHOD_DATA(version)[methodName];

        /**
         * Declare class method
         * @param {Object} reqParams
         * @returns {Promise<*>}
         * @constructor
         */
        const CLASS_METHOD = async function (reqParams = {}) {
            /**
             * Get limiter
             * @type {Promise}
             */
            //const SCHEDULE_REQUEST = this.state.limiter.schedule;

            /**
             * Check if method is private and API key is not passed
             */
            this.checkAPIKey.call(this, METHOD.isPrivate);

            /**
             * Check if params object is valid
             */
            validateRequestParams(reqParams,  METHOD);

            /**
             *
             * @type {Object} Build params from
             * request params and state object set in constructor and pass it to API caller
             */
            const REQUEST_PARAMS = BUILD_REQUEST_PARAMS(reqParams, this.state);

            /**
             * Call API fetcher by limiter schedule with METHOD object and request params concat
             */
            return  this.state.limiter.schedule(() => FETCH_API(METHOD, REQUEST_PARAMS, this.state)
                /**
                 * Check if error returned and process it
                 */
                .then(APIResponse =>   this.processAPIError.call(this, APIResponse, METHOD, REQUEST_PARAMS))
                .then(APIResponse => APIResponse));

        };

        /**
         * Set method name as the name of the function for future needs
         */
        Object.defineProperty(CLASS_METHOD, 'name', {
            value: methodName, writable: false
        });

        /**
         * Return an async function as a value for method key
         */
        return CLASS_METHOD.bind(this);
    }

    /**
     * Check response for errors and return JSON or throw smth
     * @param APIResponse
     * @param method
     * @param reqParams
     * @returns {any}
     */
    processAPIError(APIResponse, method, reqParams) {

        /**
         * If response is not successful and option is to return JSON, return it. Or throw an error
         */
        return APIResponse.success ? APIResponse : (!APIResponse.success &&
            reqParams.APIErrorsToJSON) ?
                APIResponse :
                ErrorEmitter.emit('API_Error', APIResponse);
    }

    /**
     * Check if method requires auth and API key was not passed
     * @param methodIsPrivate
     * @returns {boolean}
     */
    checkAPIKey(methodIsPrivate) {

        return !this.state.APIKey &&
            methodIsPrivate &&
            ErrorEmitter.emit('client_error', 'no_api_key_for_private_method');
    }


};

/**
 * Creates an unreachable state object
 * @param state
 */
function setState(state) {
    Object.keys(state).map((key) => {
        STATE[key] = state[key];
    });
}
