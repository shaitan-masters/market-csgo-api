//@ts-ignore
const JOI = require("joi");
//@ts-ignore
const CURRENCIES_ENUM = require("./../../../../enums/currencies");

module.exports = JOI.object(
  Object.freeze({
    getPrice: {
      currency: JOI.string()
        .valid(...CURRENCIES_ENUM)
        .required(),
    },
    getMoney: null,
    goOffline: null,
    ping: null,
    updateInventory: null,
    items: null,
    history: null,
    trades: null,
    transferDiscounts: null,
    getMySteamId: null,
    myInventory: null,
    buy: null,
    buyFor: null,
    getBuyInfoByCustomId: null,
    getListBuyInfoByCustomId: null,
    addToSale: null,
    setPrice: null,
    removeAllFromSale: null,
    tradeRequestGive: null,
    tradeRequestGiveP2p: null,
    tradeRequestGiveP2pAll: null,
    searchItemByHashName: null,
    searchItemByHashNameSpecific: null,
    searchListItemsByHashNameAll: null,
    getListItemsInfo: null,
    test: null,
    getPricesWithClassInstance: null,
  })
);
