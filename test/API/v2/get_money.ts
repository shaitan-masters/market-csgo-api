module.exports = APIProvider => {
    describe('Test getMoney method', () => {
        test('Call getMoney method', async () => {

                let response = await APIProvider.v2.getMoney();
                  expect(response).not.toEqual(null);
                 expect(response).toHaveProperty('success');
                 expect(response).toHaveProperty('money');
                 expect(response).toHaveProperty('currency');
        });
    });
};
