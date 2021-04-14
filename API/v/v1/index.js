const REQUEST_PARAMS_VALIDATION_SCHEMA = require('./enums/request_params_validation_schema')
const RESPONSE_VALIDATION_SCHEMA = require('./enums/resp_validation_schema');
const PARSE_CSV_TO_JSON = require('./../../fetch/helpers/parse_csv_to_json');

module.exports = () => {

    const METHODS = {
        private: {
            setToken: {
                route: 'SetToken'
            },
            operationHistory: {
                route: 'OperationHistory'
            },
            getProfileItems: {
                route: 'GetProfileItems'
            },
            itemInfo: {
                route: 'ItemInfo'
            },
            setPrice: {
                route: 'SetPrice'
            },
            itemRequest: {
                route: 'ItemRequest'
            },
            massSetPrice: {
                route: 'MassSetPrice'
            },
            getOrders: {
                route: 'GetOrders'
            },
            insertOrder: {
                route: 'InsertOrder'
            },
            updateOrder: {
                route: 'UpdateOrder'
            },
            processOrder: {
                route: 'ProcessOrder'
            },
            updateNotification: {
                route: 'UpdateNotification'
            },
            getMassInfo: {
                route: 'MassInfo',
                method: 'POST'
            },
            getFloatHash: {
                route: 'GetFloatHash',
                method: 'POST'
            }
        }, public: {
            getDBFileName: {
                route: 'itemdb/current_730.json',
                noAPI: true
            },
            getDBData: {
                route: 'itemdb',
                responseType: 'file',
                callback: PARSE_CSV_TO_JSON,
                noAPI: true
            },
            getHistory: {
                route: 'history',
                noAPI: true
            }
        }
    };


    const METHODS_TO_EXPORT = {};

    Object.keys(METHODS).map(methodType => {
        Object.keys(type).map(method => {
            METHODS_TO_EXPORT[method] = {
                ...type[method],
                isPrivate: methodType === 'private',
                paramsValidationSchema: REQUEST_PARAMS_VALIDATION_SCHEMA(method),
                responseValidationSchema: RESPONSE_VALIDATION_SCHEMA(method),
                version: 'v1',
                responseType: type[method].responseType || 'json'
            }
        })
    })
    return Object.freeze(METHODS_TO_EXPORT);
}