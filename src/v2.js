/**
 * Allows to call APIProvder.v1.someMethod()
 * @returns  {Object} with async functions as values methodName: function
 */
module.exports = function () {
    var _this = this;
    return {
        getMoney: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'getMoney'); },
        goOffline: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'goOffline'); },
        ping: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'ping'); },
        updateInventory: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'updateInventory'); },
        items: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'items'); },
        history: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'history'); },
        trades: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'trades'); },
        transferDiscounts: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'transferDiscounts'); },
        getMySteamId: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'getMySteamId'); },
        myInventory: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'myInventory'); },
        buy: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'buy'); },
        buyFor: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'buyFor'); },
        getBuyInfoByCustomId: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'getBuyInfoByCustomId'); },
        getListBuyInfoByCustomId: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'getListBuyInfoByCustomId'); },
        addToSale: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'addToSale'); },
        setPrice: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'setPrice'); },
        removeAllFromSale: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'removeAllFromSale'); },
        tradeRequestGive: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'tradeRequestGive'); },
        tradeRequestGiveP2p: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'tradeRequestGiveP2p'); },
        tradeRequestGiveP2pAll: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'tradeRequestGiveP2pAll'); },
        searchItemByHashName: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'searchItemByHashName'); },
        searchItemByHashNameSpecific: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'searchItemByHashNameSpecific'); },
        searchListItemsByHashNameAll: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'searchListItemsByHashNameAll'); },
        getListItemsInfo: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'getListItemsInfo'); },
        getWSAuth: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'getWSAuth'); },
        test: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'test'); },
        getPrices: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'getPrices'); },
        getPricesWithClassInstance: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v2', 'getPricesWithClassInstance'); }
    };
};
