const PARSE_CSV_TO_JSON = require("./../../../fetch/helpers/parse_csv_to_json");

module.exports = Object.freeze({
  private: {
    setToken: {
      route: "SetToken",
    },
    operationHistory: {
      route: "OperationHistory",
    },
    getProfileItems: {
      route: "GetProfileItems",
    },
    itemInfo: {
      route: "ItemInfo",
    },
    setPrice: {
      route: "SetPrice",
    },
    itemRequest: {
      route: "ItemRequest",
    },
    massSetPrice: {
      route: "MassSetPrice",
    },
    getOrders: {
      route: "GetOrders",
    },
    insertOrder: {
      route: "InsertOrder",
    },
    updateOrder: {
      route: "UpdateOrder",
    },
    processOrder: {
      route: "ProcessOrder",
    },
    updateNotification: {
      route: "UpdateNotification",
    },
    getMassInfo: {
      route: "MassInfo",
      method: "POST",
    },
    getFloatHash: {
      route: "GetFloatHash",
      method: "POST",
    },
    getWSAuth: {
      route: "GetWSAuth",
    },
  },
  public: {
    getDBFileName: {
      route: "itemdb/current_730.json",
      noAPI: true,
    },
    getDBData: {
      route: "itemdb",
      responseType: "file",
      callback: PARSE_CSV_TO_JSON,
      noAPI: true,
    },
    getHistory: {
      route: "history",
      noAPI: true,
    },
  },
});
