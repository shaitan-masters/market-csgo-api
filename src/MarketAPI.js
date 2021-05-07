var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Bottleneck = require('bottleneck');
var _a = require('./../helpers'), validateInitOptions = _a.validateInitOptions, validateRequestParams = _a.validateRequestParams;
var _b = require('./../enums'), LIMITER_OPTIONS = _b.limiterOptions, DEFAULT_API_PARAMS = _b.defaultAPIParams;
var ErrorEmitter = require('@ErrorEmitter');
var getMethodData = require('./../API/v/helpers/get_method_data');
var fetchAPI = require('./../API/fetch');
var buildRequestParams = require('./../helpers/build_request_params');
var STATE = {};
var v1 = require('./v1');
var v2 = require('./v2');
module.exports = /** @class */ (function () {
    /**
     *
     * @param {Object} initOptions - take options and create state
     */
    function MarketAPI(initOptions) {
        if (initOptions === void 0) { initOptions = {}; }
        /**
         * Validate init options with Joi.
         * No args or false value will be assigned to an object
         */
        validateInitOptions(initOptions);
        var APIErrorsToJSON = initOptions.APIErrorsToJSON, APIKey = initOptions.APIKey, getWarnings = initOptions.getWarnings, _a = initOptions.APIParams, APIParams = _a === void 0 ? {} : _a;
        /**
         * Create independent state from passed options argument
         */
        this.state = {
            /**
             *  Check if client would like to get Market API errors as JSON w/o throwing
             *  Default is false
             */
            APIErrorsToJSON: APIErrorsToJSON,
            /**
             * Check if client would like to get warnings
             */
            getWarnings: getWarnings,
            /**
             * Limiter options be always used cause the limit 5 requests/sec seems to stay for a long time (14.04.2021)
             */
            limiter: new Bottleneck(LIMITER_OPTIONS),
            APIKey: APIKey,
            /**
             * Params to be used during API calls
             */
            APIParams: {
                /**
                 * Save currency  and use it if the client won't pass this param in functions calls. Default is USD
                 */
                currency: APIParams.currency || DEFAULT_API_PARAMS.currency,
                language: APIParams.language || DEFAULT_API_PARAMS.language,
                /**
                 * App id being used in the filename of DB json. Can be passed in the method getDBName by the client
                 */
                marketAppId: APIParams.marketAppId || DEFAULT_API_PARAMS.marketAppId
            }
        };
        /**
         *
         * @type {Function} - bind class builder to this
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
     *
     * @param {any} customParam
     * @returns {Object} - returns init options and client's param to test class initialization
     */
    MarketAPI.prototype.test = function (customParam) {
        return __assign(__assign({}, this.initOptions), { customParam: customParam });
    };
    /**
     * @param {Object} reqParams
     * @param {String} version
     * @param {String} methodName
     * @returns {Function} - takes request params, version and method name and returns
     * a class method like APIProvider.v1.someMethod({param1: 'string'})
     */
    MarketAPI.prototype.callMethod = function (reqParams, version, methodName) {
        if (reqParams === void 0) { reqParams = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var METHOD_DATA, REQUEST_PARAMS;
            var _this = this;
            return __generator(this, function (_a) {
                METHOD_DATA = getMethodData(version)[methodName];
                /**
                 * Check if method is private and API key is not passed
                 */
                this.checkAPIKey.call(this, METHOD_DATA.isPrivate);
                /**
                 * Check if params object is valid
                 */
                validateRequestParams(reqParams, METHOD_DATA.requestValidationSchema);
                REQUEST_PARAMS = buildRequestParams(reqParams, this.state);
                /**
                 * Call API fetcher by limiter schedule with METHOD object and request params concat
                 */
                return [2 /*return*/, this.state.limiter.schedule(function () { return fetchAPI(METHOD_DATA, REQUEST_PARAMS, _this.state)
                        /**
                         * Check if error returned and process it
                         */
                        .then(function (APIResponse) { return _this.processAPIError.call(_this, APIResponse, METHOD_DATA, REQUEST_PARAMS); })
                        .then(function (APIResponse) { return APIResponse; }); })];
            });
        });
    };
    /**
     * Check response for errors and return JSON or throw smth
     * @param APIResponse
     * @param method
     * @param reqParams
     * @returns {any}
     */
    MarketAPI.prototype.processAPIError = function (APIResponse, method, reqParams) {
        /**
         * If response is not successful and option is to return JSON, return it. Or throw an error
         */
        return APIResponse.success ? APIResponse : (!APIResponse.success && reqParams.APIErrorsToJSON) ? APIResponse : ErrorEmitter.emit('API_Error', APIResponse);
    };
    /**
     * Check if method requires auth and API key was not passed
     * @param methodIsPrivate
     * @returns {boolean}
     */
    MarketAPI.prototype.checkAPIKey = function (methodIsPrivate) {
        return !this.state.APIKey && methodIsPrivate && ErrorEmitter.emit('client_error', 'no_api_key_for_private_method');
    };
    return MarketAPI;
}());
/**
 * Creates an unreachable state object
 * @param state
 */
function setState(state) {
    Object.keys(state).map(function (key) {
        STATE[key] = state[key];
    });
}
