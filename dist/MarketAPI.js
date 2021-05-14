const Bottleneck = require('bottleneck');
const { validateInitOptions, validateRequestParams } = require('./helpers');
const { limiterOptions: LIMITER_OPTIONS, defaultAPIParams: DEFAULT_API_PARAMS } = require('./enums');
// @ts-ignore
const errorEmitter = require('./emitters/error');
const getMethodData = require('./API/v/helpers/get_method_data');
const fetchAPI = require('./API/fetch');
const buildRequestParams = require('./helpers/build_request_params');
const v1 = require('./methods/v1');
const v2 = require('./methods/v2');
module.exports = class MarketAPI {
    /**
     *
     * @param {Object} initOptions - take options and create state
     */
    constructor(initOptions = {}) {
        this.state = {
            APIErrorsToJSON: false,
            currency: 'USD',
            language: 'en',
            marketAppId: '730',
            APIKey: '',
            getWarnings: false,
            /**
             * Limiter options be always used cause the limit 5 requests/sec seems to stay for a long time (14.04.2021)
             */
            limiter: new Bottleneck(LIMITER_OPTIONS)
        };
        /**
         * Validate init options with Joi.
         * No args or false value will be assigned to an object
         */
        validateInitOptions(initOptions);
        /**
         * Create independent state from passed options argument
         */
        this.state = {
            /**
             *  Check if client would like to get Market API errors as JSON w/o throwing
             *  Default is false
             */
            APIErrorsToJSON: initOptions.APIErrorsToJSON || this.state.APIErrorsToJSON,
            /**
             * Check if client would like to get warnings
             */
            getWarnings: initOptions.getWarnings || this.state.getWarnings,
            /**
             * Limiter options be always used cause the limit 5 requests/sec seems to stay for a long time (14.04.2021)
             */
            limiter: this.state.limiter,
            APIKey: initOptions.APIKey || '',
            /**
             * Params to be used during API calls
             */
            /**
             * Save currency  and use it if the client won't pass this param in functions calls. Default is USD
             */
            currency: initOptions.currency || DEFAULT_API_PARAMS.currency,
            language: initOptions.language || DEFAULT_API_PARAMS.language,
            /**
             * App id being used in the filename of DB json. Can be passed in the method getDBName by the client
             */
            marketAppId: initOptions.marketAppId || DEFAULT_API_PARAMS.marketAppId,
        };
        /**
         *
         * @type {Function} - bind class builder to this to access methods after it's being called from v1/v2
         */
        this.callMethod = this.callMethod.bind(this);
        /**
         * Create getter v1 to be called like APIProvider.v1.pingPong()
         */
        Object.defineProperty(this, 'v1', { get: v1.bind(this) });
        /**
         * Create getter v2 to be called like APIProvider.v2.getMoney()
         */
        Object.defineProperty(this, 'v2', { get: v2.bind(this) });
    }
    /**
     * @param {Object} reqParams
     * @param {String} version
     * @param {String} methodName
     * @returns {Function} - takes request params, version and method name and returns
     * a class method like APIProvider.v1.someMethod({param1: 'string'})
     */
    async callMethod(reqParams = {}, version, methodName) {
        /**
         * Import method from method props object
         */
        const METHOD_DATA = getMethodData(version)[methodName];
        /**
         * Check if params object is valid
         */
        validateRequestParams(reqParams, METHOD_DATA.requestValidationSchema);
        /**
         *
         * @type {Object} Build params from
         * request params and state object set in constructor and pass it to API caller
         */
        const REQUEST_PARAMS = buildRequestParams(reqParams, this.state);
        /**
         * Call API fetcher by limiter schedule with METHOD object and request params concat
         */
        return this.state.limiter.schedule(() => fetchAPI(METHOD_DATA, REQUEST_PARAMS, this.state)
            /**
             * Check if error returned and process it
             */
            .then((APIResponse) => this.processAPIError.call(this, APIResponse, METHOD_DATA, REQUEST_PARAMS))
            .then((APIResponse) => APIResponse));
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
        return APIResponse.success ?
            APIResponse :
            (!APIResponse.success && reqParams.APIErrorsToJSON) ?
                APIResponse :
                errorEmitter.emit('API_Error', APIResponse);
    }
};
