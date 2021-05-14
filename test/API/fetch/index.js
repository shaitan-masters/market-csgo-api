const APIProvider = require('./../../../dist/MarketAPI');

module.exports = () => {

    describe('Test v2 methods', () => {

        const API_PROVIDER = new APIProvider({
            APIKey: process.APIKey
        });

        require('./../v2/get_money')(API_PROVIDER);
        require('./../v2/go_offline')(API_PROVIDER);

    });
};
