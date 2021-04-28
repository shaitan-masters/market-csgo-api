module.exports = APIProvider => {
    describe('Test getMoney method', () => {
        test('Call getMoney method', async () => {
            try {
                let response = await APIProvider.v2.getMoney();

                console.log({response});
                expect(response).not.toEqual(null);
            } catch (exx){
                console.error({exx})
            }
        });
    });
};
