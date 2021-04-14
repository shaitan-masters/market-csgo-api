const REQUEST_PARAMS_VALIDATION_SCHEMA = require('./enums/request_params_validation_schema')
const RESPONSE_VALIDATION_SCHEMA = require('./enums/resp_validation_schema');
module.exports = () => {

    const METHODS = {
        private: {
            getMoney: {
                route: 'get-money'
            },
            goOffline: {
                route: 'go-offline'
            },
            ping: {
                route: 'ping'
            },
            updateInventory: {
                route: 'update-inventory'
            },
            items: {
                route: 'items'
            },
            history: {
                route: 'history'
            },
            trades: {
                route: 'trades'
            },
            transferDiscounts: {
                route: 'transfer-discounts'
            },
            getMySteamId: {
                route: 'get-my-steam-id'
            },
            myInventory: {
                route: 'my-inventory'
            },
            buy: {
                route: 'buy'
            },
            buyFor: {
                route: 'buy-for'
            },
            getBuyInfoByCustomId: {
                route: 'get-buy-info-by-custom-id'
            },
            getListBuyInfoByCustomId: {
                route: 'get-list-buy-info-by-custom-id'
            },
            addToSale: {
                route: 'add-to-sale'
            },
            setPrice: {
                route: 'set-price'
            },
            removeAllFromSale: {
                route: 'remove-all-from-sale'
            },
            tradeRequestGive: {
                route: 'trade-request-give'
            },
            tradeRequestGiveP2p: {
                route: 'trade-request-give-p2p'
            },
            tradeRequestGiveP2pAll: {
                route: 'trade-request-give-p2p-all'
            },
            searchItemByHashName: {
                route: 'search-item-by-hash-name'
            },
            searchItemByHashNameSpecific: {
                route: 'search-item-by-hash-name-specific'
            },
            searchListItemsByHashNameAll: {
                route: 'search-list-items-by-hash-name-all'
            },
            getListItemsInfo: {
                route: 'get-list-items-info'
            },
            test: {
                route: 'test'
            }
        },
        public: {
            getPrices: {
                route: 'prices'

            },
            getPricesWithClassInstance: {
                route: 'prices/class_instance'
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
                version: 'v2',

            }
        })
    })
    return Object.freeze(METHODS_TO_EXPORT)

}