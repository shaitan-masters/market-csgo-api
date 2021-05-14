/**
 * Allows to call APIProvder.v1.someMethod()
 * @returns  {Object} with async functions as values methodName: function
 */
module.exports = function () {
    return {
        setToken: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'setToken'),
        operationHistory: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'operationHistory'),
        getProfileItems: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'getProfileItems'),
        itemInfo: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'itemInfo'),
        setPrice: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'setPrice'),
        itemRequest: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'itemRequest'),
        massSetPrice: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'massSetPrice'),
        getOrders: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'getOrders'),
        insertOrder: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'insertOrder'),
        updateOrder: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'updateOrder'),
        processOrder: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'processOrder'),
        updateNotification: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'updateNotification'),
        getMassInfo: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'getMassInfo'),
        getFloatHash: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'getFloatHash'),
        getWSAuth: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'getWSAuth'),
        getDBFileName: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'getDBFileName'),
        getDBData: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'getDBData'),
        getHistory: (reqParams) => this.callMethod.call(this, reqParams, 'v1', 'getHistory')
    };
};
