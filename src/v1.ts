/**
 * Allows to call APIProvder.v1.someMethod()
 * @returns  {Object} with async functions as values methodName: function
 */
module.exports = function () {
    return {
        setToken: (reqParams: object) => this.callMethod.call(this, reqParams, 'v1', 'setToken'),
        operationHistory: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'operationHistory'),
        getProfileItems: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'getProfileItems'),
        itemInfo: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'itemInfo'),
        setPrice: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'setPrice'),
        itemRequest: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'itemRequest'),
        massSetPrice: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'massSetPrice'),
        getOrders: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'getOrders'),
        insertOrder: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'insertOrder'),
        updateOrder: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'updateOrder'),
        processOrder: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'processOrder'),
        updateNotification: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'updateNotification'),
        getMassInfo: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'getMassInfo'),
        getFloatHash: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'getFloatHash'),
        getWSAuth: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'getWSAuth'),
        getDBFileName: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'getDBFileName'),
        getDBData: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'getDBData'),
        getHistory: (reqParams: object)  => this.callMethod.call(this, reqParams, 'v1', 'getHistory')
    };
}
