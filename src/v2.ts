/**
 * Allows to call APIProvder.v1.someMethod()
 * @returns  {Object} with async functions as values methodName: function
 */
module.exports =   function    () {
    return {
        /**
         *
         * @param reqParams {Object}
         * This method returns current balance and
         * Requires API key
         */
        getMoney:  (reqParams?: object)  => this.callMethod.call(this, reqParams, 'v2', 'getMoney'),
        goOffline: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'goOffline'),
        ping: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'ping'),
        updateInventory: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'updateInventory'),
        items: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'items'),
        history: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'history'),
        trades: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'trades'),
        transferDiscounts: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'transferDiscounts'),
        getMySteamId: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'getMySteamId'),
        myInventory: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'myInventory'),
        /**
         *
         * @param reqParams {Object}
         *
         */
        buy: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'buy'),
        buyFor: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'buyFor'),
        getBuyInfoByCustomId: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'getBuyInfoByCustomId'),
        getListBuyInfoByCustomId: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'getListBuyInfoByCustomId'),
        addToSale: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'addToSale'),
        setPrice: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'setPrice'),
        removeAllFromSale: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'removeAllFromSale'),
        tradeRequestGive: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'tradeRequestGive'),
        tradeRequestGiveP2p: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'tradeRequestGiveP2p'),
        tradeRequestGiveP2pAll: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'tradeRequestGiveP2pAll'),
        searchItemByHashName: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'searchItemByHashName'),
        searchItemByHashNameSpecific: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'searchItemByHashNameSpecific'),
        searchListItemsByHashNameAll: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'searchListItemsByHashNameAll'),
        getListItemsInfo: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'getListItemsInfo'),
        getWSAuth: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'getWSAuth'),
        test: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'test'),
        getPrices: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'getPrices'),
        getPricesWithClassInstance: (reqParams: object)  =>  this.callMethod.call(this, reqParams, 'v2', 'getPricesWithClassInstance')
    };
}
