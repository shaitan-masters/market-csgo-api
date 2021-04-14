const JOI = require('joi');
const CURRENCIES_ENUM = require('./../../../../enums/currencies');

module.exports = JOI.object(Object.freeze({
    getPrice: {
        currency: JOI.string().valid(...CURRENCIES_ENUM).required()
    },
    getMoney: {},
    goOffline: {},
    ping: {},
    updateInventory: {},
    items: {},
    history: {},
    trades: {},
    transferDiscounts: {},
    getMySteamId: {},
    myInventory: {},
    buy: {},
    buyFor: {},
    getBuyInfoByCustomId: {},
    getListBuyInfoByCustomId: {},
    addToSale: {},
    setPrice: {},
    removeAllFromSale: {},
    tradeRequestGive: {},
    tradeRequestGiveP2p: {},
    tradeRequestGiveP2pAll: {},
    searchItemByHashName: {},
    searchItemByHashNameSpecific: {},
    searchListItemsByHashNameAll: {},
    getListItemsInfo: {},
    test: {},
    getPricesWithClassInstance: {}
}))