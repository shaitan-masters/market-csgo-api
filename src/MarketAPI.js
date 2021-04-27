const BOTTLENECK = require("bottleneck");
const CONFIG = require("config");
const {
    VALIDATE_INIT_OPTIONS,
    VALIDATE_PARAMS,
    LOG_API_RESPONSE,
} = require("./../helpers");
const {CLIENT_ERROR_EMITTER, API_ERROR_EMITTER} = require("@emitters");
const API_CONFIG = CONFIG.get("APIConfig");
const {LIMITER_OPTIONS, MARKET_API_VERSIONS} = require("./../enums");
const CONSTRUCT_API_METHODS = require("./../API/v/helpers/construct_API_methods");
const FETCH_API = require("./../API/fetch");
const BUILD_REQUEST_PARAMS = require("./../helpers/build_request_params");
const STATE = {};

module.exports = class MarketAPI {
    // In case one would like to use public methods only, can create new MarketAPI() without args
    constructor(initOptions = {}) {
        //Validate init options with Joi. Must be an object with optional api key.
        VALIDATE_INIT_OPTIONS(initOptions);

        this.initOptions = initOptions;
        // Create independent state from passed argument
        setState({
            //Spread options set by client
            ...initOptions,

            //Check if client would like to get Market API errors as JSON w/o throwing
            //This can be set on any further request to change it's particular response. Default is false
            APIErrorsToJSON: initOptions.APIErrorsToJSON || false,

            // Decide if one wants to get console warnings about non-crashing error, future deprecations etc
            getWarnings: initOptions.getWarnings || false,

            // Decide if one wants to wait for all methods execution
            //Params to be used as query parameters or to concat URL
            APIParams: {
                //Save currency  and use it if the client won't pass this param in functions calls
                //Default is RUB
                currency: initOptions.currency || "RUB",

                //Save language and use it if the client won't pass this param in method calls
                //Default is English
                language: initOptions.language || "en",

                // App id being used in the filename of DB json. Can be passed in the method getDBName by the client
                marketAppId: initOptions.marketAppId || 730,

                APIKey: initOptions.APIKey,

                // Get API config from enums with base URL etc
                ...API_CONFIG,
            },
            //Limiter options be always used cause the limit 5 requests/sec seems to stay for a long time (14.04.2021)
            limiter: new BOTTLENECK(LIMITER_OPTIONS),
        });

        MARKET_API_VERSIONS.map(version => this.setVersions.call(this, version));
    }

    async test(customParam) {
        return {
            ...this.initOptions,
            customParam,
        };
    }

    setVersions(version) {
        this[version] = {};
        Object.keys(CONSTRUCT_API_METHODS(version)).map(
            (methodNameAsKey, i, APImethods) => {
                this.buildClassMethod(version, methodNameAsKey, APImethods[methodNameAsKey])
            })
        Object.freeze(this[version]);

    }

    //Dynamically building class methods
    //
    buildClassMethod(version, methodName, method) {


      / const METHOD = async function (clientRequestParams) {
            const SCHEDULE_REQUEST = STATE.limiter.schedule;

            //Check if method is private and API key is not passed
            SELF.checkAPIKey(method.isPrivate);

            // Check if params object is valid
            SELF.validateRequestParams(clientRequestParams, method);

            //Build request params object
            const REQUEST_PARAMS = BUILD_REQUEST_PARAMS(clientRequestParams, STATE);

            //Call API fetcher by limiter schedule
            return (
                SCHEDULE_REQUEST(() => FETCH_API(method, REQUEST_PARAMS))
                    // Return result of callback function or result itself
                    .then((APIResponse) =>
                        APIResponse.error
                            ? SELF.returnError(APIResponse, method, REQUEST_PARAMS)
                            : APIResponse
                    )
            );
        }
        Object.defineProperty(METHOD, 'name', {value: methodName, writable: false});
        this[version][methodName] = METHOD.bind(this);
    }

    returnError(APIResponse, method, requestParams) {
        return requestParams.APIErrorsToJSON
            ? APIResponse
            : API_ERROR_EMITTER.emit("error", APIResponse);
    }

    checkAPIKey(methodIsPrivate) {
        return (
            !STATE.APIParams.apiKey &&
            methodIsPrivate &&
            CLIENT_ERROR_EMITTER.emit("error", "no_api_key_for_private_method")
        );
    }

    validateRequestParams(requestParams, method) {
        return VALIDATE_PARAMS(requestParams, method.paramsValidationSchema);
    }
};

function

setState(state) {
    Object.keys(state).map((key) => {
        STATE[key] = state[key];
    });
}
