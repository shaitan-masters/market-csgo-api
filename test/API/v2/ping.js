module.exports = APIProvider => {
    describe('Test getMoney method', () => {
        test('getMoney method shall have property `success` = true', async () => {

            let response = await APIProvider.v2.getMoney();
            expect(response).not.toEqual(null);
            expect(response).toHaveProperty('success');
            expect(response.success).toEqual(true);

            expect(response).toHaveProperty('money');
            expect(response).toHaveProperty('currency');
        });
    });
};
