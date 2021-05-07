/**
 * Allows to call APIProvder.v1.someMethod()
 * @returns  {Object} with async functions as values methodName: function
 */
module.exports = function () {
    return {
        getMoney: () => this.callMethod.call(this, null, 'v2', 'getMoney'),
        goOffline: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'goOffline'),
        ping: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'ping'),
        updateInventory: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'updateInventory'),
        items: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'items'),
        history: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'history'),
        trades: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'trades'),
        transferDiscounts: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'transferDiscounts'),
        getMySteamId: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'getMySteamId'),
        myInventory: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'myInventory'),
        buy: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'buy'),
        buyFor: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'buyFor'),
        getBuyInfoByCustomId: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'getBuyInfoByCustomId'),
        getListBuyInfoByCustomId: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'getListBuyInfoByCustomId'),
        addToSale: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'addToSale'),
        setPrice: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'setPrice'),
        removeAllFromSale: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'removeAllFromSale'),
        tradeRequestGive: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'tradeRequestGive'),
        tradeRequestGiveP2p: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'tradeRequestGiveP2p'),
        tradeRequestGiveP2pAll: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'tradeRequestGiveP2pAll'),
        searchItemByHashName: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'searchItemByHashName'),
        searchItemByHashNameSpecific: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'searchItemByHashNameSpecific'),
        searchListItemsByHashNameAll: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'searchListItemsByHashNameAll'),
        getListItemsInfo: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'getListItemsInfo'),
        getWSAuth: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'getWSAuth'),
        test: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'test'),
        getPrices: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'getPrices'),
        getPricesWithClassInstance: (reqParams) => this.callMethod.call(this, reqParams, 'v2', 'getPricesWithClassInstance')
    };
};
//# sourceMappingURL=v2.js.map