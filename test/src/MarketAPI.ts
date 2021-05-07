const MarketAPI = require('./../../src/MarketAPI');
let error = null;
let APIProvider;

module.exports = () => {
    describe('Valid creation', () => {

        afterEach(() => {
            APIProvider = null;
            error = null;
        });

        test('create without args', () => {

            try {
                APIProvider = new MarketAPI();
            } catch (ex) {
                error = ex;
            }
            expect(error).toEqual(null);
            expect(APIProvider instanceof MarketAPI).toBe(true);

        });
        test('create with empty object', () => {

            try {
                APIProvider = new MarketAPI({});
            } catch (ex) {
                error = ex;
            }
            expect(error).toEqual(null);
            expect(APIProvider instanceof MarketAPI).toBe(true);

        });

    });

    describe('Invalid creation', () => {

        test('create with string  shall throw error with errorType `client`', () => {
            const STR = Math.random().toString(36).substring(7);
            try {
                APIProvider = new MarketAPI(STR);
            } catch (ex) {
                error = ex;
            }
            expect(error).not.toEqual(null);
            expect(error).toHaveProperty('errorType');
            expect(error.errorType).toEqual('client');
            expect(APIProvider instanceof MarketAPI).not.toBe(true);

        });
        test('create with integer shall throw error with errorType `client`' , () => {
            const INT = Math.floor(Math.random() * (10000 - -10000));
            try {
                APIProvider = new MarketAPI(INT);
            } catch (ex) {
                error = ex;
            }
            expect(error).not.toEqual(null);
            expect(error).toHaveProperty('errorType');
            expect(error.errorType).toEqual('client');
            expect(APIProvider instanceof MarketAPI).not.toBe(true);

        });

        test('create with float shall throw error with errorType `client`' , () => {
            const INT =  Math.random() * (10000 - -10000);
            try {
                APIProvider = new MarketAPI(INT);
            } catch (ex) {
                error = ex;
            }
            expect(error).not.toEqual(null);
            expect(error).toHaveProperty('errorType');
            expect(error.errorType).toEqual('client');
            expect(APIProvider instanceof MarketAPI).not.toBe(true);

        });

        test('create with null shall throw error with errorType `client`', () => {

            try {
                APIProvider = new MarketAPI(null);
            } catch (ex) {
                 error = ex;
            }
            expect(error).not.toEqual(null);
            expect(error).toHaveProperty('errorType');
            expect(error.errorType).toEqual('client');
            expect(APIProvider instanceof MarketAPI).not.toBe(true);

        });

        test('create with zero shall throw error with errorType `client`', () => {

            try {
                APIProvider = new MarketAPI(0);
            } catch (ex) {
                 error = ex;
            }
            expect(error).not.toEqual(null);
            expect(error).toHaveProperty('errorType');
            expect(error.errorType).toEqual('client');
            expect(APIProvider instanceof MarketAPI).not.toBe(true);

        });
    });

};
