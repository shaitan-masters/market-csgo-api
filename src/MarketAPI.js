require('module-alias/register');
const BOTTLENECK = require('bottleneck');
const CONFIG = require('config');
const {VALIDATE_INIT_OPTIONS, VALIDATE_PARAMS, LOG_API_RESPONSE} = require('./../helpers');
const {  CLIENT_ERROR_EMITTER, API_ERROR_EMITTER, CRASH_EMITTER} = require('@emitters');
const API_CONFIG = CONFIG.get('APIConfig');
const {LIMITER_OPTIONS, MARKET_API_VERSIONS} = require('./../enums');
 const MARKET_API_METHODS = {
    v1: require('./../API/v/v1'),
    v2: require('./../API/v/v2')
};
const FETCH_API = require('./../API/fetch');


module.exports = class MarketApi {


    // In case one would like to use public methods only, can create new MarketAPI() without args
    constructor(options = {}) {

        //Validate init options with Joi. Must be an object with optional api key.
        VALIDATE_INIT_OPTIONS(options);

        // Create instance state from passed argument
        this.state = Object.freeze({
            //Spread options set by client
            ...options,
            //Check if client would like to get Market API errors as JSON w/o throwing
            //This can be set on any further request to change it's particular response. Default is false
            APIErrorsToJSON: options.APIErrorsToJSON || false,
            //saves Market API responses to JSON file by path provided by user. The wrong path will cause console warn
            //This param can be set on ay request also
            logAPIResponse: options.logAPIResponse || false,
            // Decide if you want to get console warnings about non-crashing error, future deprecations etc
            getWarnings: options.getWarnings || false,
            //Params to be used as query parameters or to concat URL
            APIParams: {
                //Save currency  and use it if the client don't pass this param in functions calls
                //Default is RUB
                currency: options.currency || 'RUB',
                //Save language and use it if the client don't pass this param in method calls
                //Default is English
                language: options.language || 'en',
                // App id being used in the filename of DB json. Can be passed in the method getDBName by the client
                marketAppId: 730,
                APIKey: options.APIKey,
                // Get API config from enums with base URL etc
                ...API_CONFIG
            },
            //Limiter options be always used cause the limit 5 requests/sec seems to stay for a long time (14.04.2021)
            limiter: new BOTTLENECK(LIMITER_OPTIONS)
        });

        //Iterate over options and use sweet JS private method
        MARKET_API_VERSIONS.map(this.#setVersionMethods)
    };

    #setVersionMethods(version) {
        this[version] = {};
        Object.keys(MARKET_API_METHODS[version]).map((methodName, i, methods) => {
            this[version][methodName] = this.#buildAMethod(version, methodName, methods[methodName]);
        })
        Object.freeze(this[version])
    }

    #buildAMethod(version, methodName, method) {

        const SELF = this;
        const STATE = SELF.state;
        return async function (methodParams) {
            SELF.#checkAPIKey(method.isPrivate);
            SELF.#validateParams(methodParams, method);
            return SELF
                .limiter
                //Call API fetcher by limiter schedule
                .schedule(FETCH_API(methodName, method, methodParams, STATE))
                .then(APIResponse => {
                    //Log to file if option is selected
                    methodParams.logAPIResponse || (STATE.logAPIResponse && methodParams.logAPIResponse !== false) &&
                        LOG_API_RESPONSE(APIResponse, STATE);
                    return APIResponse;
                })
                // Return result of callback function or result itself
                .then(APIResponse =>  APIResponse.error ?
                    SELF.#returnError(APIResponse, methodName,method, methodParams) :
                            method.callback ?
                                method.callback(APIResponse, methodParams) :
                                APIResponse

                )
                .catch(errorWhileFetching => CRASH_EMITTER.emit('error', errorWhileFetching))

        }
    };

    #returnError(APIResponse, methodName, method, methodParams){
        const STATE = this.state;
        return (methodParams.APIErrorsToJSON || (STATE.APIErrorsToJSON && methodParams.APIErrorsToJSON !== false)) ?
            APIResponse :
                API_ERROR_EMITTER.emit('error', APIResponse)
    }

    #checkAPIKey(methodIsPrivate) {
        return !this.state.APIParams.apiKey &&
            methodIsPrivate && CLIENT_ERROR_EMITTER.emit('error', 'no_api_key_for_private_method');
    };

    static #validateParams(methodParams, method) {
        return VALIDATE_PARAMS(methodParams, method.paramsValidationSchema);
    }
}


