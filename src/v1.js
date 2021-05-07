/**
 * Allows to call APIProvder.v1.someMethod()
 * @returns  {Object} with async functions as values methodName: function
 */
module.exports = function () {
    var _this = this;
    return {
        setToken: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'setToken'); },
        operationHistory: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'operationHistory'); },
        getProfileItems: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'getProfileItems'); },
        itemInfo: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'itemInfo'); },
        setPrice: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'setPrice'); },
        itemRequest: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'itemRequest'); },
        massSetPrice: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'massSetPrice'); },
        getOrders: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'getOrders'); },
        insertOrder: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'insertOrder'); },
        updateOrder: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'updateOrder'); },
        processOrder: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'processOrder'); },
        updateNotification: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'updateNotification'); },
        getMassInfo: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'getMassInfo'); },
        getFloatHash: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'getFloatHash'); },
        getWSAuth: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'getWSAuth'); },
        getDBFileName: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'getDBFileName'); },
        getDBData: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'getDBData'); },
        getHistory: function (reqParams) { return _this.callMethod.call(_this, reqParams, 'v1', 'getHistory'); }
    };
};
