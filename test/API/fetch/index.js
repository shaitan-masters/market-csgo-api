const APIProvider = require('./../../../src/MarketAPI');

module.exports = () => {

    describe('Test v2 methods', () => {

        const API_PROVIDER = new APIProvider({
            APIKey: process.APIKey
        });

        require('./../v2/get_money')(API_PROVIDER);

    });
};
